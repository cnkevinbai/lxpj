# Kubernetes 部署技能（强化版）

## 📋 技能说明

使用 Kubernetes 进行容器编排和生产级部署。

---

## 🎯 Kubernetes 核心概念

### 架构组件

```
┌─────────────────────────────────────────────────────┐
│                  Kubernetes Cluster                  │
├─────────────────────────────────────────────────────┤
│  Control Plane                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │API Server│ │Scheduler│ │Controller│ │etcd    │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────────────────────────────────────┤
│  Worker Nodes                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │
│  │  │Pod      │  │Pod      │  │Pod      │      │   │
│  │  │┌───────┐│  │┌───────┐│  │┌───────┐│      │   │
│  │  ││Container││  ││Container││  ││Container││     │   │
│  │  │└───────┘│  │└───────┘│  │└───────┘│      │   │
│  │  └─────────┘  └─────────┘  └─────────┘      │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📝 核心资源定义

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 3000
        
        # 资源限制
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        
        # 健康检查
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        
        # 环境变量
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        
        # 配置挂载
        volumeMounts:
        - name: config
          mountPath: /app/config
      
      volumes:
      - name: config
        configMap:
          name: app-config
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP  # ClusterIP | NodePort | LoadBalancer
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - app.example.com
    secretName: app-tls
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80
```

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  config.yaml: |
    database:
      host: postgres-service
      port: 5432
    redis:
      host: redis-service
      port: 6379
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  database-url: postgresql://user:pass@postgres:5432/db
  jwt-secret: your-jwt-secret
```

---

## 📝 常用命令

```bash
# 部署应用
kubectl apply -f deployment.yaml

# 查看资源
kubectl get pods
kubectl get services
kubectl get deployments

# 查看详情
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl logs -f <pod-name>  # 实时日志

# 进入容器
kubectl exec -it <pod-name> -- /bin/sh

# 扩缩容
kubectl scale deployment app-deployment --replicas=5

# 更新镜像
kubectl set image deployment/app-deployment app=myapp:v2

# 回滚
kubectl rollout undo deployment/app-deployment
kubectl rollout history deployment/app-deployment

# 删除资源
kubectl delete -f deployment.yaml
```

---

## ✅ 生产最佳实践

### 资源管理

- [ ] 设置合理的 requests 和 limits
- [ ] 使用 HPA 自动扩缩容
- [ ] 配置 PodDisruptionBudget

### 安全

- [ ] 使用非 root 用户运行
- [ ] 只读根文件系统
- [ ] NetworkPolicy 网络隔离
- [ ] RBAC 权限控制

### 可靠性

- [ ] 健康检查配置
- [ ] 多副本部署
- [ ] Pod 反亲和性
- [ ] 优雅关闭

---

## 📚 参考资源

- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [Kubernetes 概念](https://kubernetes.io/docs/concepts/)
- [Kubernetes 最佳实践](https://kubernetes.io/docs/concepts/security/)

---

## 📚 相关技能

- `docker` - Docker 容器
- `cicd` - CI/CD 流水线