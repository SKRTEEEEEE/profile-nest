# CI/CD strategy

## 🎯 **PRIMERA VERSIÓN (v1.0)** - Lo esencial para producción

### **on local** 
- [x] lint: ejecuta los lint (sin --fix)
- [x] tsx: check tipos ts (sin compilar)
- [x] test: ejecuta los test unitarios
- [x] conventional commits: aseguro uso de estructura

### **on push (cualquier branch)**
- [x] levantar 'servidor' -> con cache dinámico
    - [x] build: compile ts & search dist/main 
    - [x] lint: ejecuta los lint (sin --fix)
    - [x] test: ejecuta los test
- [ ] **coverage**: Test coverage --soft(60%)


### **on pull_request**
- [ ] **PR checks**: ?copia exacta del workflow de push ??
- [x] [**PR title conventional commits**](./workflows/lint-pr-title.yml)
    - [x] [**`labels` by tittle**](./workflows/conventional-label.yml)
- [x] [**`labels` based on files**](./workflows/pr-scope-label.yml)
- [x] [**size**: add rules and labels](./workflows/pr-size-labeler.yml)
- [ ] **coverage**: Test coverage --hard (80%) and add info to PR
- [x] **assign-me**: Assign the PR to the creator of the project?


- [ ] **comment con resultados**: ? en la PR automáticamente

### **on main**
- [ ] **readme**: update readme with new info(here?)
    - [ ] test coverage info
#### future-soon-
    - [ ] actualizar readme
    - [ ] nice lowlight
- [ ] **project labels**: actualizar labels con las tecnologias de desarrollo (excluir dev-deps y ciertas libs, ya pensaremos como) 
- [ ] **changelog**: add changelog
- [ ] **tag creation**: auto-tag con versión

### **regular/scheduled**
- [ ] **dependabot**: automated dependency updates
- [ ] **health checks**: daily API endpoint monitoring
- [ ] **cleanup**: ?? old artifacts, stale branches

### other conditions
- [x] **greetings**: on PR and issue
- [ ]

---

## 🚀 **SIN ASIGNAR - FUTURO** (v2.0+)

### Para aplicar en el futuro

- [ ] **release please**: automated releases con changelog
- [ ] **security audit**: npm audit + dependabot alerts
- [ ] **docker security scan**: trivy/snyk para containers

- [ ] **load testing**: k6 o artillery

- [ ] **rollback automático**: si health check falla
- [ ] **stale PR cleanup**: close old PRs

- [ ] **license scanning**: ensure compliance

- [ ] **matrix builds**: multiple Node/DB versions

### Por pensar

#### **Automatización avanzada**
- [ ] **performance regression**: lighthouse CI o similar
- [ ] **visual regression**: screenshot diffs

#### **Testing expandido**
- [ ] **integration tests**: con DB real
- [ ] **e2e tests**: Playwright/Cypress
- [ ] **contract testing**: API schemas
- [ ] **mutation testing**: stryker-mutator

#### **Deployment avanzado**
- [ ] **blue-green deploy**: zero downtime
- [ ] **multi-environment**: staging → prod pipeline
- [ ] **canary deployments**: gradual rollout

#### **Monitoring & Observability**
- [ ] **deploy notifications**: Slack con metrics
- [ ] **error tracking**: integración con Sentry
- [ ] **performance monitoring**: APM integration
- [ ] **uptime checks**: post-deploy health validation

### **Developer Experience**
- [ ] **auto-assign reviewers**: based on CODEOWNERS
- [ ] **dependency updates**: automated PRs
- [ ] **changelog generation**: from conventional commits
- [ ] **PR size warnings**: cuando PR es muy grande

### **Quality Gates**
- [ ] **code coverage**: minimum threshold enforcement
- [ ] **bundle size**: track size regressions
- [ ] **complexity analysis**: sonarqube integration
- [ ] **accessibility testing**: axe-core automation

### **Advanced CI patterns**
- [ ] **parallel testing**: split tests across runners
- [ ] **fail-fast strategies**: cancel on first failure
- [ ] **retry failed tests**: flaky test handling
- [ ] **conditional deployments**: feature flags based

