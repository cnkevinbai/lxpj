package com.daod.iov.plugin.impl;

import com.daod.iov.plugin.*;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 默认模块管理器实现
 */
public class DefaultModuleManager implements ModuleManager {
    
    private static final Logger logger = LoggerFactory.getLogger(DefaultModuleManager.class);
    
    // 模块实例映射
    private final Map<String, IModule> modules = new ConcurrentHashMap<>();
    
    // 模块状态映射
    private final Map<String, ModuleState> moduleStates = new ConcurrentHashMap<>();
    
    // 模块健康状态映射
    private final Map<String, HealthStatus> moduleHealthStatuses = new ConcurrentHashMap<>();
    
    // 模块监听器集合
    private final Set<ModuleListener> listeners = new HashSet<>();
    
    // 模块配置
    private final Map<String, Object> configurations = new ConcurrentHashMap<>();
    
    // 模块路径映射
    private final Map<String, String> modulePaths = new ConcurrentHashMap<>();
    
    // 是否已初始化
    private volatile boolean initialized = false;
    
    @Override
    public void initialize() throws ModuleException {
        logger.info("正在初始化模块管理器...");
        
        // 设置初始化状态
        initialized = true;
        
        logger.info("模块管理器初始化完成");
    }
    
    @Override
    public IModule loadModule(String modulePath) throws ModuleException {
        if (!initialized) {
            throw new ModuleException("MODULE_MANAGER_NOT_INITIALIZED", "模块管理器未初始化");
        }
        
        if (modulePath == null || modulePath.trim().isEmpty()) {
            throw new ModuleException("INVALID_MODULE_PATH", "模块路径不能为空");
        }
        
        try {
            File moduleFile = new File(modulePath);
            if (!moduleFile.exists()) {
                throw new ModuleException("MODULE_FILE_NOT_FOUND", "模块文件不存在: " + modulePath);
            }
            
            // 解析模块信息
            ModuleMetadata metadata = parseModuleMetadata(modulePath);
            String moduleId = metadata.getName() + ":" + metadata.getVersion();
            
            // 检查模块是否已加载
            if (modules.containsKey(moduleId)) {
                throw new ModuleException("MODULE_ALREADY_LOADED", "模块已加载: " + moduleId);
            }
            
            // 检查依赖
            if (!checkDependencies(metadata)) {
                throw new ModuleException("DEPENDENCY_CHECK_FAILED", "模块依赖检查失败: " + moduleId);
            }
            
            // 创建模块类加载器
            URLClassLoader moduleClassLoader = createModuleClassLoader(moduleFile);
            
            // 加载模块主类
            IModule module = loadModuleInstance(moduleClassLoader, metadata);
            
            // 创建模块上下文
            ModuleContext context = new ModuleContext(moduleId, modulePath, (Map<String, Object>) configurations.get(moduleId));
            context.setModuleManager(this);
            context.setClassLoader(moduleClassLoader);
            
            // 初始化模块
            module.initialize(context);
            
            // 设置模块状态
            moduleStates.put(moduleId, ModuleState.INITIALIZED);
            moduleHealthStatuses.put(moduleId, HealthStatus.UNKNOWN);
            
            // 保存模块实例
            modules.put(moduleId, module);
            modulePaths.put(moduleId, modulePath);
            
            // 通知监听器
            notifyModuleLoaded(module);
            
            logger.info("模块加载成功: {} ({})", moduleId, modulePath);
            
            return module;
        } catch (Exception e) {
            logger.error("加载模块失败: " + modulePath, e);
            throw new ModuleException("LOAD_MODULE_FAILED", "加载模块失败: " + e.getMessage());
        }
    }
    
    @Override
    public void unloadModule(String moduleId) throws ModuleException {
        if (!initialized) {
            throw new ModuleException("MODULE_MANAGER_NOT_INITIALIZED", "模块管理器未初始化");
        }
        
        IModule module = modules.get(moduleId);
        if (module == null) {
            throw new ModuleException("MODULE_NOT_FOUND", "模块不存在: " + moduleId);
        }
        
        try {
            // 如果模块正在运行，先停止它
            ModuleState currentState = moduleStates.getOrDefault(moduleId, ModuleState.UNINITIALIZED);
            if (currentState == ModuleState.RUNNING) {
                stopModule(moduleId);
            }
            
            // 销毁模块
            module.destroy();
            
            // 从管理器中移除
            modules.remove(moduleId);
            moduleStates.remove(moduleId);
            moduleHealthStatuses.remove(moduleId);
            modulePaths.remove(moduleId);
            configurations.remove(moduleId);
            
            // 通知监听器
            notifyModuleUnloaded(moduleId);
            
            logger.info("模块卸载成功: {}", moduleId);
        } catch (Exception e) {
            logger.error("卸载模块失败: " + moduleId, e);
            throw new ModuleException("UNLOAD_MODULE_FAILED", "卸载模块失败: " + e.getMessage());
        }
    }
    
    @Override
    public void startModule(String moduleId) throws ModuleException {
        if (!initialized) {
            throw new ModuleException("MODULE_MANAGER_NOT_INITIALIZED", "模块管理器未初始化");
        }
        
        IModule module = modules.get(moduleId);
        if (module == null) {
            throw new ModuleException("MODULE_NOT_FOUND", "模块不存在: " + moduleId);
        }
        
        ModuleState currentState = moduleStates.getOrDefault(moduleId, ModuleState.UNINITIALIZED);
        if (currentState == ModuleState.RUNNING) {
            logger.warn("模块已在运行中: {}", moduleId);
            return;
        }
        
        try {
            // 设置状态为启动中
            moduleStates.put(moduleId, ModuleState.STARTING);
            
            // 启动模块
            module.start();
            
            // 更新状态
            moduleStates.put(moduleId, ModuleState.RUNNING);
            moduleHealthStatuses.put(moduleId, HealthStatus.HEALTHY);
            
            // 通知监听器
            notifyModuleStarted(module);
            
            logger.info("模块启动成功: {}", moduleId);
        } catch (Exception e) {
            logger.error("启动模块失败: " + moduleId, e);
            moduleStates.put(moduleId, ModuleState.ERROR);
            moduleHealthStatuses.put(moduleId, HealthStatus.UNHEALTHY);
            throw new ModuleException("START_MODULE_FAILED", "启动模块失败: " + e.getMessage());
        }
    }
    
    @Override
    public void stopModule(String moduleId) throws ModuleException {
        if (!initialized) {
            throw new ModuleException("MODULE_MANAGER_NOT_INITIALIZED", "模块管理器未初始化");
        }
        
        IModule module = modules.get(moduleId);
        if (module == null) {
            throw new ModuleException("MODULE_NOT_FOUND", "模块不存在: " + moduleId);
        }
        
        ModuleState currentState = moduleStates.getOrDefault(moduleId, ModuleState.UNINITIALIZED);
        if (currentState != ModuleState.RUNNING) {
            logger.warn("模块不在运行状态: {} (当前状态: {})", moduleId, currentState);
            return;
        }
        
        try {
            // 设置状态为停止中
            moduleStates.put(moduleId, ModuleState.STOPPING);
            
            // 停止模块
            module.stop();
            
            // 更新状态
            moduleStates.put(moduleId, ModuleState.STOPPED);
            moduleHealthStatuses.put(moduleId, HealthStatus.OFFLINE);
            
            // 通知监听器
            notifyModuleStopped(module);
            
            logger.info("模块停止成功: {}", moduleId);
        } catch (Exception e) {
            logger.error("停止模块失败: " + moduleId, e);
            moduleStates.put(moduleId, ModuleState.ERROR);
            throw new ModuleException("STOP_MODULE_FAILED", "停止模块失败: " + e.getMessage());
        }
    }
    
    @Override
    public void updateModule(String moduleId, String newModulePath) throws ModuleException {
        if (!initialized) {
            throw new ModuleException("MODULE_MANAGER_NOT_INITIALIZED", "模块管理器未初始化");
        }
        
        IModule oldModule = modules.get(moduleId);
        if (oldModule == null) {
            throw new ModuleException("MODULE_NOT_FOUND", "模块不存在: " + moduleId);
        }
        
        // 获取旧版本信息
        ModuleMetadata oldMetadata = oldModule.getMetadata();
        
        try {
            // 停止旧模块
            if (moduleStates.getOrDefault(moduleId, ModuleState.UNINITIALIZED) == ModuleState.RUNNING) {
                stopModule(moduleId);
            }
            
            // 卸载旧模块
            unloadModule(moduleId);
            
            // 加载新模块
            IModule newModule = loadModule(newModulePath);
            ModuleMetadata newMetadata = newModule.getMetadata();
            
            // 启动新模块
            startModule(newMetadata.getName() + ":" + newMetadata.getVersion());
            
            // 通知监听器
            notifyModuleUpdated(moduleId, oldMetadata.getVersion(), newMetadata.getVersion());
            
            logger.info("模块更新成功: {} ({} -> {})", moduleId, oldMetadata.getVersion(), newMetadata.getVersion());
        } catch (Exception e) {
            logger.error("更新模块失败: " + moduleId, e);
            throw new ModuleException("UPDATE_MODULE_FAILED", "更新模块失败: " + e.getMessage());
        }
    }
    
    @Override
    public IModule getModule(String moduleId) {
        return modules.get(moduleId);
    }
    
    @Override
    public List<IModule> getAllModules() {
        return new ArrayList<>(modules.values());
    }
    
    @Override
    public ModuleState getModuleState(String moduleId) {
        return moduleStates.getOrDefault(moduleId, ModuleState.UNINITIALIZED);
    }
    
    @Override
    public HealthStatus getModuleHealth(String moduleId) {
        return moduleHealthStatuses.getOrDefault(moduleId, HealthStatus.UNKNOWN);
    }
    
    @Override
    public boolean checkDependencies(String moduleId) {
        IModule module = modules.get(moduleId);
        if (module == null) {
            return false;
        }
        
        ModuleMetadata metadata = module.getMetadata();
        return checkDependencies(metadata);
    }
    
    /**
     * 检查模块依赖
     */
    private boolean checkDependencies(ModuleMetadata metadata) {
        List<ModuleMetadata.Dependency> dependencies = metadata.getDependencies();
        if (dependencies == null || dependencies.isEmpty()) {
            return true;
        }
        
        for (ModuleMetadata.Dependency dependency : dependencies) {
            if (!dependency.isOptional()) {
                // 检查依赖是否满足
                boolean found = false;
                for (IModule module : modules.values()) {
                    if (module.getMetadata().getName().equals(dependency.getName())) {
                        // 检查版本兼容性
                        if (isVersionCompatible(dependency.getVersion(), module.getMetadata().getVersion())) {
                            found = true;
                            break;
                        }
                    }
                }
                
                if (!found) {
                    logger.warn("模块依赖未找到或版本不兼容: {} 依赖于 {} 版本 {}",
                               metadata.getName(), dependency.getName(), dependency.getVersion());
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * 检查版本兼容性
     * @param requiredVersion 需要的版本（支持语义化版本范围，如 ">=1.0.0", "^1.0.0", "~1.0.0" 等）
     * @param actualVersion 实际版本
     * @return 是否兼容
     */
    private boolean isVersionCompatible(String requiredVersion, String actualVersion) {
        if (requiredVersion == null || actualVersion == null) {
            return true; // 如果版本未指定，则认为兼容
        }
        
        // 支持语义化版本范围格式，如 "^1.0.0", "~1.0.0", ">=1.0.0" 等
        try {
            // 处理 ^ 符号 (兼容主版本号，如 ^1.0.0 兼容 1.x.x)
            if (requiredVersion.startsWith("^")) {
                String version = requiredVersion.substring(1).trim();
                return isCompatibleWithCaret(actualVersion, version);
            }
            // 处理 ~ 符号 (兼容次版本号，如 ~1.2.0 兼容 1.2.x)
            else if (requiredVersion.startsWith("~")) {
                String version = requiredVersion.substring(1).trim();
                return isCompatibleWithTilde(actualVersion, version);
            }
            // 处理 >=, >, <=, <, = 操作符
            else if (requiredVersion.startsWith(">=")) {
                String version = requiredVersion.substring(2).trim();
                return compareVersions(actualVersion, version) >= 0;
            } else if (requiredVersion.startsWith(">")) {
                String version = requiredVersion.substring(1).trim();
                return compareVersions(actualVersion, version) > 0;
            } else if (requiredVersion.startsWith("<=")) {
                String version = requiredVersion.substring(2).trim();
                return compareVersions(actualVersion, version) <= 0;
            } else if (requiredVersion.startsWith("<")) {
                String version = requiredVersion.substring(1).trim();
                return compareVersions(actualVersion, version) < 0;
            } else if (requiredVersion.startsWith("=") || !requiredVersion.contains(">") && !requiredVersion.contains("<")) {
                // 如果没有操作符，默认为精确匹配
                String version = requiredVersion.startsWith("=") ? requiredVersion.substring(1).trim() : requiredVersion.trim();
                return compareVersions(actualVersion, version) == 0;
            }
        } catch (Exception e) {
            logger.warn("版本比较失败: {} vs {}", requiredVersion, actualVersion, e);
        }
        
        // 如果无法解析版本规则，默认认为兼容
        return true;
    }
    
    /**
     * 检查版本是否与 caret 格式兼容 (^1.0.0 表示兼容 1.x.x)
     * @param actualVersion 实际版本
     * @param requiredVersion 要求的版本
     * @return 是否兼容
     */
    private boolean isCompatibleWithCaret(String actualVersion, String requiredVersion) {
        String[] actualParts = actualVersion.split("\\.");
        String[] requiredParts = requiredVersion.split("\\.");
        
        // 如果要求的版本主版本为0，则次版本也必须相同
        if (requiredParts.length > 0 && "0".equals(requiredParts[0])) {
            // 对于 0.x.y 版本，只有当主版本和次版本都相同时才兼容
            if (requiredParts.length >= 2) {
                if (actualParts.length < 2) return false;
                return actualParts[0].equals(requiredParts[0]) &&
                       actualParts[1].equals(requiredParts[1]);
            }
        }
        
        // 对于非0主版本，只要主版本相同就兼容
        if (requiredParts.length > 0) {
            if (actualParts.length < 1) return false;
            return actualParts[0].equals(requiredParts[0]);
        }
        
        return true;
    }
    
    /**
     * 检查版本是否与 tilde 格式兼容 (~1.2.0 表示兼容 1.2.x)
     * @param actualVersion 实际版本
     * @param requiredVersion 要求的版本
     * @return 是否兼容
     */
    private boolean isCompatibleWithTilde(String actualVersion, String requiredVersion) {
        String[] actualParts = actualVersion.split("\\.");
        String[] requiredParts = requiredVersion.split("\\.");
        
        // 必须主版本和次版本都相同
        if (requiredParts.length >= 2) {
            if (actualParts.length < 2) return false;
            return actualParts[0].equals(requiredParts[0]) &&
                   actualParts[1].equals(requiredParts[1]);
        }
        
        // 如果只指定了主版本，则只需主版本相同
        if (requiredParts.length >= 1) {
            if (actualParts.length < 1) return false;
            return actualParts[0].equals(requiredParts[0]);
        }
        
        return true;
    }
    
    /**
     * 比较两个版本号
     * @param version1 第一个版本
     * @param version2 第二个版本
     * @return 0如果相等，负数如果version1小于version2，正数如果version1大于version2
     */
    private int compareVersions(String version1, String version2) {
        String[] parts1 = version1.split("\\.");
        String[] parts2 = version2.split("\\.");
        
        int length = Math.max(parts1.length, parts2.length);
        
        for (int i = 0; i < length; i++) {
            int part1 = i < parts1.length ? Integer.parseInt(parts1[i]) : 0;
            int part2 = i < parts2.length ? Integer.parseInt(parts2[i]) : 0;
            
            if (part1 != part2) {
                return Integer.compare(part1, part2);
            }
        }
        
        return 0;
    }
    
    @Override
    public Map<String, List<String>> resolveDependencies(List<String> modules) {
        // 更完整的依赖解析实现，包括循环依赖检测
        Map<String, List<String>> dependencyGraph = new HashMap<>();
        Map<String, IModule> moduleMap = new HashMap<>();
        
        // 构建模块映射
        for (String moduleId : modules) {
            IModule module = getModule(moduleId);
            if (module != null) {
                moduleMap.put(moduleId, module);
            }
        }
        
        // 解析每个模块的依赖
        for (Map.Entry<String, IModule> entry : moduleMap.entrySet()) {
            String moduleId = entry.getKey();
            IModule module = entry.getValue();
            ModuleMetadata metadata = module.getMetadata();
            List<String> deps = new ArrayList<>();
            
            if (metadata.getDependencies() != null) {
                for (ModuleMetadata.Dependency dep : metadata.getDependencies()) {
                    if (!dep.isOptional()) { // 只包含必需的依赖
                        deps.add(dep.getName());
                    }
                }
            }
            
            dependencyGraph.put(moduleId, deps);
        }
        
        // 检测循环依赖
        if (hasCircularDependency(dependencyGraph)) {
            logger.warn("检测到循环依赖，请检查模块依赖配置");
        }
        
        return dependencyGraph;
    }
    
    /**
     * 检测依赖图中是否存在循环依赖
     * @param dependencyGraph 依赖关系图
     * @return 是否存在循环依赖
     */
    private boolean hasCircularDependency(Map<String, List<String>> dependencyGraph) {
        Set<String> visited = new HashSet<>();
        Set<String> recursionStack = new HashSet<>();
        
        for (String module : dependencyGraph.keySet()) {
            if (!visited.contains(module)) {
                if (isCyclicUtil(module, visited, recursionStack, dependencyGraph)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * 辅助方法：检测是否有循环依赖
     */
    private boolean isCyclicUtil(String module, Set<String> visited,
                                 Set<String> recursionStack,
                                 Map<String, List<String>> dependencyGraph) {
        if (!visited.contains(module)) {
            visited.add(module);
            recursionStack.add(module);
            
            List<String> dependencies = dependencyGraph.get(module);
            if (dependencies != null) {
                for (String dependent : dependencies) {
                    if (!visited.contains(dependent) &&
                        isCyclicUtil(dependent, visited, recursionStack, dependencyGraph)) {
                        return true;
                    } else if (recursionStack.contains(dependent)) {
                        return true;
                    }
                }
            }
        }
        recursionStack.remove(module);
        return false;
    }
    
    @Override
    public void registerModuleListener(ModuleListener listener) {
        if (listener != null) {
            listeners.add(listener);
        }
    }
    
    @Override
    public void unregisterModuleListener(ModuleListener listener) {
        listeners.remove(listener);
    }
    
    @Override
    public void shutdown() {
        logger.info("正在关闭模块管理器...");
        
        // 停止所有运行中的模块
        for (String moduleId : new ArrayList<>(modules.keySet())) {
            try {
                ModuleState state = moduleStates.get(moduleId);
                if (state == ModuleState.RUNNING) {
                    stopModule(moduleId);
                }
                unloadModule(moduleId);
            } catch (Exception e) {
                logger.error("关闭模块失败: " + moduleId, e);
            }
        }
        
        // 清空所有集合
        modules.clear();
        moduleStates.clear();
        moduleHealthStatuses.clear();
        modulePaths.clear();
        configurations.clear();
        listeners.clear();
        
        initialized = false;
        
        logger.info("模块管理器已关闭");
    }
    
    /**
     * 解析模块元数据
     */
    private ModuleMetadata parseModuleMetadata(String modulePath) throws Exception {
        File moduleFile = new File(modulePath);
        
        if (moduleFile.isDirectory()) {
            // 如果是目录，查找module.yaml文件
            File yamlFile = new File(moduleFile, "module.yaml");
            if (!yamlFile.exists()) {
                yamlFile = new File(moduleFile, "module.yml");
            }
            
            if (yamlFile.exists()) {
                return parseModuleMetadataFromYaml(yamlFile);
            }
        } else if (moduleFile.isFile() && modulePath.toLowerCase().endsWith(".jar")) {
            // 如果是JAR文件，从中提取module.yaml
            return parseModuleMetadataFromJar(moduleFile);
        }
        
        // 如果找不到配置文件，抛出异常
        throw new ModuleException("MODULE_CONFIG_NOT_FOUND", "模块配置文件未找到: " + modulePath);
    }
    
    /**
     * 从YAML文件解析模块元数据
     */
    private ModuleMetadata parseModuleMetadataFromYaml(File yamlFile) throws Exception {
        ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
        Map<String, Object> yamlData = yamlMapper.readValue(yamlFile, Map.class);
        
        // 提取metadata部分
        Map<String, Object> metadataMap = (Map<String, Object>) yamlData.get("metadata");
        if (metadataMap == null) {
            throw new ModuleException("INVALID_MODULE_CONFIG", "模块配置缺少metadata部分");
        }
        
        ModuleMetadata metadata = new ModuleMetadata();
        metadata.setName((String) metadataMap.get("name"));
        metadata.setVersion((String) metadataMap.get("version"));
        metadata.setDescription((String) metadataMap.get("description"));
        metadata.setAuthor((String) metadataMap.get("author"));
        metadata.setLicense((String) metadataMap.get("license"));
        
        // 提取spec部分
        Map<String, Object> specMap = (Map<String, Object>) yamlData.get("spec");
        if (specMap != null) {
            metadata.setType((String) specMap.get("type"));
            metadata.setPriority(((Integer) specMap.get("priority")).intValue());
            
            // 解析依赖
            List<Map<String, Object>> dependenciesList = (List<Map<String, Object>>) specMap.get("dependencies");
            if (dependenciesList != null) {
                List<ModuleMetadata.Dependency> dependencies = new ArrayList<>();
                for (Map<String, Object> depMap : dependenciesList) {
                    ModuleMetadata.Dependency dep = new ModuleMetadata.Dependency();
                    dep.setName((String) depMap.get("name"));
                    dep.setVersion((String) depMap.get("version"));
                    dep.setOptional((Boolean) depMap.get("optional"));
                    dependencies.add(dep);
                }
                metadata.setDependencies(dependencies);
            }
            
            // 解析扩展点
            List<Map<String, Object>> extensionPointsList = (List<Map<String, Object>>) specMap.get("extensionPoints");
            if (extensionPointsList != null) {
                Map<String, ModuleMetadata.ExtensionPoint> extensionPoints = new HashMap<>();
                for (Map<String, Object> extMap : extensionPointsList) {
                    ModuleMetadata.ExtensionPoint ext = new ModuleMetadata.ExtensionPoint();
                    ext.setName((String) extMap.get("name"));
                    ext.setInterfaceClass((String) extMap.get("interface"));
                    ext.setDescription((String) extMap.get("description"));
                    extensionPoints.put(ext.getName(), ext);
                }
                metadata.setExtensionPoints(extensionPoints);
            }
            
            // 解析资源需求
            Map<String, Object> resourcesMap = (Map<String, Object>) specMap.get("resources");
            if (resourcesMap != null) {
                ModuleMetadata.Resources resources = new ModuleMetadata.Resources();
                resources.setCpu((String) resourcesMap.get("cpu"));
                resources.setMemory((String) resourcesMap.get("memory"));
                metadata.setResources(resources);
            }
            
            // 解析健康检查
            Map<String, Object> healthCheckMap = (Map<String, Object>) specMap.get("healthCheck");
            if (healthCheckMap != null) {
                ModuleMetadata.HealthCheck healthCheck = new ModuleMetadata.HealthCheck();
                healthCheck.setLiveness((String) healthCheckMap.get("liveness"));
                healthCheck.setReadiness((String) healthCheckMap.get("readiness"));
                metadata.setHealthCheck(healthCheck);
            }
            
            // 解析热更新策略
            Map<String, Object> hotReloadMap = (Map<String, Object>) specMap.get("hotReload");
            if (hotReloadMap != null) {
                ModuleMetadata.HotReload hotReload = new ModuleMetadata.HotReload();
                hotReload.setEnabled((Boolean) hotReloadMap.get("enabled"));
                hotReload.setStrategy((String) hotReloadMap.get("strategy"));
                hotReload.setMaxUnavailable(((Integer) hotReloadMap.get("maxUnavailable")).intValue());
                metadata.setHotReload(hotReload);
            }
        }
        
        return metadata;
    }
    
    /**
     * 从JAR文件解析模块元数据
     */
    private ModuleMetadata parseModuleMetadataFromJar(File jarFile) throws Exception {
        try (JarFile jar = new JarFile(jarFile)) {
            ZipEntry entry = jar.getEntry("module.yaml");
            if (entry == null) {
                entry = jar.getEntry("module.yml");
            }
            
            if (entry != null) {
                try (java.io.InputStream inputStream = jar.getInputStream(entry)) {
                    byte[] content = inputStream.readAllBytes();
                    String yamlContent = new String(content, java.nio.charset.StandardCharsets.UTF_8);
                    
                    ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
                    Map<String, Object> yamlData = yamlMapper.readValue(yamlContent, Map.class);
                    return parseModuleYamlData(yamlData);
                }
            }
        }
        
        throw new ModuleException("MODULE_CONFIG_NOT_FOUND", "JAR文件中未找到module.yaml配置文件: " + jarFile.getName());
    }
    
    /**
     * 从YAML数据解析模块元数据
     */
    private ModuleMetadata parseModuleYamlData(Map<String, Object> yamlData) throws ModuleException {
        // 提取metadata部分
        Map<String, Object> metadataMap = (Map<String, Object>) yamlData.get("metadata");
        if (metadataMap == null) {
            throw new ModuleException("INVALID_MODULE_CONFIG", "模块配置缺少metadata部分");
        }
        
        ModuleMetadata metadata = new ModuleMetadata();
        metadata.setName((String) metadataMap.get("name"));
        metadata.setVersion((String) metadataMap.get("version"));
        metadata.setDescription((String) metadataMap.get("description"));
        metadata.setAuthor((String) metadataMap.get("author"));
        metadata.setLicense((String) metadataMap.get("license"));
        
        // 提取spec部分
        Map<String, Object> specMap = (Map<String, Object>) yamlData.get("spec");
        if (specMap != null) {
            metadata.setType((String) specMap.get("type"));
            Object priorityObj = specMap.get("priority");
            if (priorityObj instanceof Integer) {
                metadata.setPriority((Integer) priorityObj);
            } else if (priorityObj instanceof Long) {
                metadata.setPriority(((Long) priorityObj).intValue());
            }
            
            // 解析依赖
            List<Map<String, Object>> dependenciesList = (List<Map<String, Object>>) specMap.get("dependencies");
            if (dependenciesList != null) {
                List<ModuleMetadata.Dependency> dependencies = new ArrayList<>();
                for (Map<String, Object> depMap : dependenciesList) {
                    ModuleMetadata.Dependency dep = new ModuleMetadata.Dependency();
                    dep.setName((String) depMap.get("name"));
                    dep.setVersion((String) depMap.get("version"));
                    Object optionalObj = depMap.get("optional");
                    dep.setOptional(optionalObj != null && (Boolean) optionalObj);
                    dependencies.add(dep);
                }
                metadata.setDependencies(dependencies);
            }
            
            // 解析扩展点
            List<Map<String, Object>> extensionPointsList = (List<Map<String, Object>>) specMap.get("extensionPoints");
            if (extensionPointsList != null) {
                Map<String, ModuleMetadata.ExtensionPoint> extensionPoints = new HashMap<>();
                for (Map<String, Object> extMap : extensionPointsList) {
                    ModuleMetadata.ExtensionPoint ext = new ModuleMetadata.ExtensionPoint();
                    ext.setName((String) extMap.get("name"));
                    ext.setInterfaceClass((String) extMap.get("interface"));
                    ext.setDescription((String) extMap.get("description"));
                    extensionPoints.put(ext.getName(), ext);
                }
                metadata.setExtensionPoints(extensionPoints);
            }
            
            // 解析资源需求
            Map<String, Object> resourcesMap = (Map<String, Object>) specMap.get("resources");
            if (resourcesMap != null) {
                ModuleMetadata.Resources resources = new ModuleMetadata.Resources();
                resources.setCpu((String) resourcesMap.get("cpu"));
                resources.setMemory((String) resourcesMap.get("memory"));
                metadata.setResources(resources);
            }
            
            // 解析健康检查
            Map<String, Object> healthCheckMap = (Map<String, Object>) specMap.get("healthCheck");
            if (healthCheckMap != null) {
                ModuleMetadata.HealthCheck healthCheck = new ModuleMetadata.HealthCheck();
                healthCheck.setLiveness((String) healthCheckMap.get("liveness"));
                healthCheck.setReadiness((String) healthCheckMap.get("readiness"));
                metadata.setHealthCheck(healthCheck);
            }
            
            // 解析热更新策略
            Map<String, Object> hotReloadMap = (Map<String, Object>) specMap.get("hotReload");
            if (hotReloadMap != null) {
                ModuleMetadata.HotReload hotReload = new ModuleMetadata.HotReload();
                Object enabledObj = hotReloadMap.get("enabled");
                hotReload.setEnabled(enabledObj != null && (Boolean) enabledObj);
                hotReload.setStrategy((String) hotReloadMap.get("strategy"));
                Object maxUnavailableObj = hotReloadMap.get("maxUnavailable");
                if (maxUnavailableObj instanceof Integer) {
                    hotReload.setMaxUnavailable((Integer) maxUnavailableObj);
                } else if (maxUnavailableObj instanceof Long) {
                    hotReload.setMaxUnavailable(((Long) maxUnavailableObj).intValue());
                }
                metadata.setHotReload(hotReload);
            }
        }
        
        return metadata;
    }
    
    /**
     * 创建模块类加载器
     */
    private URLClassLoader createModuleClassLoader(File moduleFile) throws Exception {
        URL[] urls = {moduleFile.toURI().toURL()};
        return new URLClassLoader(urls, Thread.currentThread().getContextClassLoader());
    }
    
    /**
     * 加载模块实例
     */
    private IModule loadModuleInstance(URLClassLoader classLoader, ModuleMetadata metadata) throws Exception {
        // 从模块元数据中获取主类名
        String mainClassName = metadata.getMainClass();
        if (mainClassName == null || mainClassName.trim().isEmpty()) {
            // 如果没有指定主类，则尝试从manifest中获取，或使用默认策略查找
            mainClassName = findModuleMainClass(classLoader, metadata);
        }
        Class<?> moduleClass = classLoader.loadClass(mainClassName);
        return (IModule) moduleClass.getDeclaredConstructor().newInstance();
    }
    
    /**
     * 查找模块主类
     * @param classLoader 模块类加载器
     * @param metadata 模块元数据
     * @return 主类名
     * @throws Exception 查找失败时抛出异常
     */
    private String findModuleMainClass(URLClassLoader classLoader, ModuleMetadata metadata) throws Exception {
        // 在生产环境中，这里应该扫描JAR文件中的类来查找实现IModule接口的类
        // 为了简化，我们使用约定优于配置的方式，基于模块名生成默认类名
        String moduleName = metadata.getName();
        if (moduleName == null || moduleName.trim().isEmpty()) {
            throw new ModuleException("MODULE_NAME_INVALID", "模块名称无效");
        }

        // 将模块名转换为首字母大写的驼峰命名，并添加Module后缀
        String[] parts = moduleName.replace('-', '_').split("_");
        StringBuilder classNameBuilder = new StringBuilder();
        for (String part : parts) {
            if (part.length() > 0) {
                classNameBuilder.append(Character.toUpperCase(part.charAt(0)));
                if (part.length() > 1) {
                    classNameBuilder.append(part.substring(1).toLowerCase());
                }
            }
        }
        classNameBuilder.append("Module");

        // 默认包名
        String defaultPackageName = "com.daod.iov.module";
        String defaultClassName = defaultPackageName + "." + classNameBuilder.toString();

        // 检查这个类是否存在并实现IModule接口
        try {
            Class<?> clazz = classLoader.loadClass(defaultClassName);
            if (IModule.class.isAssignableFrom(clazz)) {
                return defaultClassName;
            }
        } catch (ClassNotFoundException e) {
            // 类不存在，继续尝试其他方式
            logger.debug("默认模块类未找到: {}", defaultClassName);
        }

        // 如果默认类不存在，可以尝试扫描JAR中的所有类（这里简化处理，返回错误提示）
        throw new ModuleException("MAIN_CLASS_NOT_SPECIFIED", "模块 '" + metadata.getName() + "' 未指定主类，请在模块元数据中配置mainClass属性或遵循命名约定");
    }
    
    /**
     * 通知模块加载事件
     */
    private void notifyModuleLoaded(IModule module) {
        for (ModuleListener listener : listeners) {
            try {
                listener.onModuleLoaded(module);
            } catch (Exception e) {
                logger.error("通知模块监听器失败", e);
            }
        }
    }
    
    /**
     * 通知模块卸载事件
     */
    private void notifyModuleUnloaded(String moduleId) {
        for (ModuleListener listener : listeners) {
            try {
                listener.onModuleUnloaded(moduleId);
            } catch (Exception e) {
                logger.error("通知模块监听器失败", e);
            }
        }
    }
    
    /**
     * 通知模块启动事件
     */
    private void notifyModuleStarted(IModule module) {
        for (ModuleListener listener : listeners) {
            try {
                listener.onModuleStarted(module);
            } catch (Exception e) {
                logger.error("通知模块监听器失败", e);
            }
        }
    }
    
    /**
     * 通知模块停止事件
     */
    private void notifyModuleStopped(IModule module) {
        for (ModuleListener listener : listeners) {
            try {
                listener.onModuleStopped(module);
            } catch (Exception e) {
                logger.error("通知模块监听器失败", e);
            }
        }
    }
    
    /**
     * 通知模块更新事件
     */
    private void notifyModuleUpdated(String moduleId, String oldVersion, String newVersion) {
        for (ModuleListener listener : listeners) {
            try {
                listener.onModuleUpdated(moduleId, oldVersion, newVersion);
            } catch (Exception e) {
                logger.error("通知模块监听器失败", e);
            }
        }
    }
}