# 认证服务模块 (auth-service)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | auth-service |
| 模块版本 | 1.0.0 |
| 模块类型 | core |
| 优先级 | 40 |
| 负责人 | 后端开发 |
| 开发周期 | Week 10-11 |

### 1.2 功能描述

认证服务模块提供统一的身份认证和授权管理，支持JWT令牌管理、会话管理、多因素认证等功能。

### 1.3 核心能力

- 用户登录认证
- JWT令牌管理
- 会话管理
- 多因素认证
- 单点登录(SSO)
- 令牌刷新

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          认证服务架构                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              认证层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        认证处理器                                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │密码认证     │ │短信认证     │ │令牌认证     │ │设备认证     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              令牌层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        JWT令牌管理                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │令牌生成     │ │令牌验证     │ │令牌刷新     │ │令牌吊销     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              会话层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        会话管理                                          │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │会话创建     │ │会话查询     │ │会话续期     │ │会话销毁     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.auth;

public interface AuthService {
    
    LoginResult login(LoginRequest request);
    
    LoginResult loginWithMfa(MfaLoginRequest request);
    
    void logout(String token);
    
    void logoutAll(String accountId);
    
    TokenResult refreshToken(String refreshToken);
    
    boolean validateToken(String token);
    
    TokenInfo getTokenInfo(String token);
}

public interface TokenService {
    
    String generateToken(TokenPayload payload);
    
    String generateRefreshToken(String accountId);
    
    TokenInfo parseToken(String token);
    
    boolean validateToken(String token);
    
    boolean isTokenExpired(String token);
    
    void revokeToken(String token);
    
    void revokeAllTokens(String accountId);
}

public interface SessionService {
    
    Session createSession(String accountId, SessionCreateRequest request);
    
    Session getSession(String sessionId);
    
    Session getSessionByToken(String token);
    
    void updateSession(String sessionId, SessionUpdateRequest request);
    
    void destroySession(String sessionId);
    
    void destroyAllSessions(String accountId);
    
    List<Session> listSessions(String accountId);
    
    void keepAlive(String sessionId);
}

public interface MfaService {
    
    MfaSetupResult setupMfa(String accountId);
    
    void enableMfa(String accountId, String code);
    
    void disableMfa(String accountId, String code);
    
    boolean verifyMfa(String accountId, String code);
    
    MfaStatus getMfaStatus(String accountId);
}

public interface PasswordService {
    
    void changePassword(String accountId, PasswordChangeRequest request);
    
    void resetPassword(String accountId, String newPassword);
    
    boolean validatePassword(String rawPassword, String encodedPassword);
    
    String encodePassword(String rawPassword);
    
    void checkPasswordStrength(String password);
}
```

### 2.3 数据模型

```java
@Data
public class LoginRequest {
    private String username;
    private String password;
    private String tenantCode;
    private String captcha;
    private String captchaKey;
    private String deviceId;
    private String deviceType;
}

@Data
public class LoginResult {
    private boolean success;
    private String token;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private String accountId;
    private String accountType;
    private String tenantId;
    private String dashboardUrl;
    private List<String> permissions;
    private LocalDateTime expireTime;
    private String errorMessage;
}

@Data
public class TokenPayload {
    private String accountId;
    private String accountType;
    private String tenantId;
    private String username;
    private List<String> roles;
    private List<String> permissions;
    private String deviceId;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
}

@Data
public class TokenInfo {
    private String tokenId;
    private String accountId;
    private String accountType;
    private String tenantId;
    private String username;
    private List<String> roles;
    private List<String> permissions;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private boolean valid;
}

@Data
public class Session {
    private String id;
    private String accountId;
    private String tenantId;
    private String deviceId;
    private String deviceType;
    private String clientIp;
    private String userAgent;
    private String token;
    private SessionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime lastActiveAt;
    private LocalDateTime expireAt;
}

@Data
public class MfaSetupResult {
    private String secret;
    private String qrCodeUrl;
    private List<String> backupCodes;
}

public enum SessionStatus {
    ACTIVE,
    EXPIRED,
    TERMINATED
}

public enum MfaStatus {
    DISABLED,
    ENABLED,
    PENDING
}
```

### 2.4 数据库设计

```sql
CREATE TABLE auth_tokens (
    id VARCHAR(32) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    token_type VARCHAR(20) NOT NULL,
    device_id VARCHAR(50),
    client_ip VARCHAR(50),
    issued_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_sessions (
    id VARCHAR(32) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    device_id VARCHAR(50),
    device_type VARCHAR(30),
    client_ip VARCHAR(50),
    user_agent VARCHAR(500),
    token_id VARCHAR(32),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP,
    expire_at TIMESTAMP NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE auth_mfa_settings (
    id VARCHAR(32) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL UNIQUE,
    mfa_type VARCHAR(20) DEFAULT 'TOTP',
    secret VARCHAR(100),
    backup_codes JSONB,
    enabled BOOLEAN DEFAULT FALSE,
    enabled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE auth_login_logs (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32),
    account_id VARCHAR(32),
    username VARCHAR(100),
    login_type VARCHAR(20),
    client_ip VARCHAR(50),
    user_agent VARCHAR(500),
    status VARCHAR(20),
    failure_reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_password_history (
    id VARCHAR(32) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE INDEX idx_tokens_account ON auth_tokens(account_id);
CREATE INDEX idx_tokens_hash ON auth_tokens(token_hash);
CREATE INDEX idx_sessions_account ON auth_sessions(account_id);
CREATE INDEX idx_login_logs_account ON auth_login_logs(account_id);
CREATE INDEX idx_login_logs_time ON auth_login_logs(created_at);
```

### 2.5 JWT令牌实现

```java
@Service
public class JwtTokenServiceImpl implements TokenService {
    
    @Value("${auth.jwt.secret}")
    private String jwtSecret;
    
    @Value("${auth.jwt.access-token-expire-minutes:60}")
    private int accessTokenExpireMinutes;
    
    @Value("${auth.jwt.refresh-token-expire-days:7}")
    private int refreshTokenExpireDays;
    
    @Value("${auth.jwt.issuer:daod-iov}")
    private String issuer;
    
    private final JwtParser jwtParser;
    private final JwtBuilder jwtBuilder;
    
    @PostConstruct
    public void init() {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        jwtParser = Jwts.parserBuilder()
            .setSigningKey(key)
            .build();
        
        jwtBuilder = Jwts.builder()
            .signWith(key, SignatureAlgorithm.HS256)
            .setIssuer(issuer);
    }
    
    @Override
    public String generateToken(TokenPayload payload) {
        String tokenId = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(accessTokenExpireMinutes);
        
        String token = jwtBuilder
            .setId(tokenId)
            .setSubject(payload.getAccountId())
            .setIssuedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()))
            .setExpiration(Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant()))
            .claim("accountType", payload.getAccountType())
            .claim("tenantId", payload.getTenantId())
            .claim("username", payload.getUsername())
            .claim("roles", payload.getRoles())
            .claim("permissions", payload.getPermissions())
            .claim("deviceId", payload.getDeviceId())
            .compact();
        
        saveTokenRecord(tokenId, payload, expiresAt);
        
        return token;
    }
    
    @Override
    public String generateRefreshToken(String accountId) {
        String tokenId = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(refreshTokenExpireDays);
        
        String token = jwtBuilder
            .setId(tokenId)
            .setSubject(accountId)
            .setIssuedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()))
            .setExpiration(Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant()))
            .claim("type", "refresh")
            .compact();
        
        saveRefreshTokenRecord(tokenId, accountId, expiresAt);
        
        return token;
    }
    
    @Override
    public TokenInfo parseToken(String token) {
        try {
            Claims claims = jwtParser.parseClaimsJws(token).getBody();
            
            return TokenInfo.builder()
                .tokenId(claims.getId())
                .accountId(claims.getSubject())
                .accountType(claims.get("accountType", String.class))
                .tenantId(claims.get("tenantId", String.class))
                .username(claims.get("username", String.class))
                .roles(claims.get("roles", List.class))
                .permissions(claims.get("permissions", List.class))
                .issuedAt(LocalDateTime.ofInstant(claims.getIssuedAt().toInstant(), ZoneId.systemDefault()))
                .expiresAt(LocalDateTime.ofInstant(claims.getExpiration().toInstant(), ZoneId.systemDefault()))
                .valid(true)
                .build();
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException("Token has expired");
        } catch (JwtException e) {
            throw new InvalidTokenException("Invalid token: " + e.getMessage());
        }
    }
    
    @Override
    public boolean validateToken(String token) {
        try {
            Claims claims = jwtParser.parseClaimsJws(token).getBody();
            
            if (isTokenRevoked(claims.getId())) {
                return false;
            }
            
            return !claims.getExpiration().before(new Date());
        } catch (JwtException e) {
            return false;
        }
    }
    
    @Override
    public void revokeToken(String token) {
        TokenInfo tokenInfo = parseToken(token);
        markTokenRevoked(tokenInfo.getTokenId());
    }
}
```

### 2.6 登录认证实现

```java
@Service
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private TenantService tenantService;
    
    @Autowired
    private TokenService tokenService;
    
    @Autowired
    private SessionService sessionService;
    
    @Autowired
    private MfaService mfaService;
    
    @Autowired
    private PasswordService passwordService;
    
    @Autowired
    private PermissionService permissionService;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public LoginResult login(LoginRequest request) {
        logLoginAttempt(request, "PASSWORD", "PENDING");
        
        if (!validateCaptcha(request.getCaptchaKey(), request.getCaptcha())) {
            logLoginAttempt(request, "PASSWORD", "FAILED", "Invalid captcha");
            throw new AuthenticationException("Invalid captcha");
        }
        
        Tenant tenant = tenantService.getTenantByCode(request.getTenantCode());
        if (tenant == null || !tenant.isEnabled()) {
            logLoginAttempt(request, "PASSWORD", "FAILED", "Invalid tenant");
            throw new AuthenticationException("Invalid tenant");
        }
        
        Account account = accountService.getByUsername(request.getUsername());
        if (account == null) {
            logLoginAttempt(request, "PASSWORD", "FAILED", "Account not found");
            throw new AuthenticationException("Invalid credentials");
        }
        
        if (!account.getTenantId().equals(tenant.getId())) {
            logLoginAttempt(request, "PASSWORD", "FAILED", "Tenant mismatch");
            throw new AuthenticationException("Invalid credentials");
        }
        
        if (!account.isEnabled()) {
            logLoginAttempt(request, "PASSWORD", "FAILED", "Account disabled");
            throw new AuthenticationException("Account is disabled");
        }
        
        if (!passwordService.validatePassword(request.getPassword(), account.getPassword())) {
            incrementFailedAttempts(account.getId());
            logLoginAttempt(request, "PASSWORD", "FAILED", "Invalid password");
            throw new AuthenticationException("Invalid credentials");
        }
        
        if (isAccountLocked(account.getId())) {
            logLoginAttempt(request, "PASSWORD", "FAILED", "Account locked");
            throw new AuthenticationException("Account is locked due to multiple failed attempts");
        }
        
        if (mfaService.getMfaStatus(account.getId()) == MfaStatus.ENABLED) {
            String mfaToken = generateMfaToken(account.getId());
            logLoginAttempt(request, "PASSWORD", "MFA_REQUIRED");
            return LoginResult.builder()
                .success(false)
                .errorMessage("MFA_REQUIRED")
                .accountId(account.getId())
                .build();
        }
        
        resetFailedAttempts(account.getId());
        
        return createLoginResult(account, request);
    }
    
    @Override
    public LoginResult loginWithMfa(MfaLoginRequest request) {
        Account account = accountService.getById(request.getAccountId());
        
        if (account == null) {
            throw new AuthenticationException("Invalid account");
        }
        
        if (!mfaService.verifyMfa(account.getId(), request.getMfaCode())) {
            throw new AuthenticationException("Invalid MFA code");
        }
        
        return createLoginResult(account, request);
    }
    
    private LoginResult createLoginResult(Account account, LoginRequest request) {
        List<String> permissions = permissionService.getAccountPermissions(account.getId());
        List<String> roles = permissionService.getAccountRoles(account.getId());
        
        TokenPayload payload = TokenPayload.builder()
            .accountId(account.getId())
            .accountType(account.getAccountType().name())
            .tenantId(account.getTenantId())
            .username(account.getUsername())
            .roles(roles)
            .permissions(permissions)
            .deviceId(request.getDeviceId())
            .build();
        
        String token = tokenService.generateToken(payload);
        String refreshToken = tokenService.generateRefreshToken(account.getId());
        
        SessionCreateRequest sessionRequest = SessionCreateRequest.builder()
            .deviceId(request.getDeviceId())
            .deviceType(request.getDeviceType())
            .clientIp(getClientIp())
            .userAgent(getUserAgent())
            .build();
        
        Session session = sessionService.createSession(account.getId(), sessionRequest);
        
        String dashboardUrl = getDashboardUrl(account.getAccountType());
        
        logLoginAttempt(request, "PASSWORD", "SUCCESS");
        
        return LoginResult.builder()
            .success(true)
            .token(token)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn((long) accessTokenExpireMinutes * 60)
            .accountId(account.getId())
            .accountType(account.getAccountType().name())
            .tenantId(account.getTenantId())
            .dashboardUrl(dashboardUrl)
            .permissions(permissions)
            .expireTime(LocalDateTime.now().plusMinutes(accessTokenExpireMinutes))
            .build();
    }
    
    private String getDashboardUrl(AccountType accountType) {
        return switch (accountType) {
            case MANUFACTURER -> "/manufacturer/dashboard";
            case DEALER -> "/dealer/dashboard";
            case OPERATOR -> "/operator/dashboard";
            case SCENIC_ADMIN -> "/scenic/dashboard";
            case MAINTENANCE -> "/maintenance/dashboard";
            case DRIVER -> "/driver/dashboard";
        };
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/login/mfa | MFA登录 |
| POST | /api/auth/logout | 用户登出 |
| POST | /api/auth/logout/all | 登出所有设备 |
| POST | /api/auth/token/refresh | 刷新令牌 |
| GET | /api/auth/token/validate | 验证令牌 |
| GET | /api/auth/session | 获取当前会话 |
| GET | /api/auth/sessions | 获取所有会话 |
| DELETE | /api/auth/session/{id} | 销毁会话 |
| POST | /api/auth/mfa/setup | 设置MFA |
| POST | /api/auth/mfa/enable | 启用MFA |
| POST | /api/auth/mfa/disable | 禁用MFA |
| POST | /api/auth/password/change | 修改密码 |

### 3.2 API示例

```json
POST /api/auth/login
{
    "username": "admin",
    "password": "Password123!",
    "tenantCode": "DAOD001",
    "captcha": "1234",
    "captchaKey": "captcha_key_123",
    "deviceId": "device_001",
    "deviceType": "WEB"
}

Response:
{
    "code": 200,
    "message": "Login successful",
    "data": {
        "success": true,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "tokenType": "Bearer",
        "expiresIn": 3600,
        "accountId": "ACC001",
        "accountType": "MANUFACTURER",
        "tenantId": "T001",
        "dashboardUrl": "/manufacturer/dashboard",
        "permissions": ["vehicle:view", "vehicle:edit", "alarm:view"]
    }
}

POST /api/auth/token/refresh
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
    "code": 200,
    "message": "Token refreshed",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expiresIn": 3600
    }
}
```

## 4. 配置项

```yaml
auth:
  enabled: true
  jwt:
    secret: ${JWT_SECRET:your-secret-key-at-least-256-bits}
    access-token-expire-minutes: 60
    refresh-token-expire-days: 7
    issuer: daod-iov
  login:
    max-failed-attempts: 5
    lock-duration-minutes: 30
  captcha:
    enabled: true
    expire-seconds: 300
  mfa:
    enabled: true
    issuer: DAOD-IOV
  password:
    min-length: 8
    require-uppercase: true
    require-lowercase: true
    require-digit: true
    require-special: true
    history-count: 5
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testLogin | 测试登录 | 登录成功 |
| testLoginWithInvalidPassword | 测试错误密码 | 登录失败 |
| testTokenGeneration | 测试令牌生成 | 生成正确 |
| testTokenValidation | 测试令牌验证 | 验证正确 |
| testTokenRefresh | 测试令牌刷新 | 刷新成功 |
| testMfaSetup | 测试MFA设置 | 设置成功 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testFullLoginFlow | 测试完整登录流程 | 流程正常 |
| testSessionManagement | 测试会话管理 | 管理正确 |
| testMultiDeviceLogin | 测试多设备登录 | 多设备正常 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: tenant-service
    version: ">=1.0.0"
  - name: role-service
    version: ">=1.0.0"
```

## 7. 部署说明

### 7.1 资源需求

```yaml
resources:
  cpu: "100m"
  memory: "128Mi"
```

## 8. 监控指标

| 指标名 | 类型 | 描述 |
|-------|------|------|
| auth_login_total | Counter | 登录总次数 |
| auth_login_success | Counter | 登录成功次数 |
| auth_login_failed | Counter | 登录失败次数 |
| auth_token_generated | Counter | 令牌生成次数 |
| auth_session_active | Gauge | 活跃会话数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
