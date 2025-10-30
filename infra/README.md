# 🏗️ Proyecto de Infraestructura como Código (IaC)

## 📋 Información del Proyecto

**Asignatura:** Infraestructura como Código  
**Objetivo:** Desarrollar un entorno de infraestructura completo, automatizado y seguro mediante IaC, aplicando principios de idempotencia, modularidad, versionamiento y seguridad por diseño.

---

## 🎯 Arquitectura del Proyecto

### Componentes Implementados

- **Red (Network):** VPC con subredes públicas y privadas, Internet Gateway, NAT Gateway, tablas de rutas
- **Cómputo (Compute):** Instancia EC2 con configuración automatizada vía Ansible
- **Almacenamiento (Storage):** Bucket S3 con cifrado y versionamiento
- **Seguridad (Security):** Security Groups con reglas restrictivas, sin exposición 0.0.0.0/0
- **IAM:** Roles y políticas con privilegios mínimos
- **Validaciones:** Checkov, TFLint, Terraform Validate integrados en CI/CD

---

## 📁 Estructura del Proyecto

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # Pipeline CI/CD automatizado
├── app/
│   ├── src/
│   │   ├── app.js
│   │   └── server.js
│   ├── test/
│   │   └── app.test.js
│   ├── Dockerfile
│   ├── package.json
│   └── jest.config.cjs
├── infra/
│   └── terraform/
│       ├── main.tf                # Orquestador principal
│       ├── variables.tf           # Variables globales
│       ├── outputs.tf             # Outputs del proyecto
│       ├── backend.tf             # Configuración de backend remoto
│       ├── versions.tf            # Versiones de providers
│       ├── terraform.tfvars.example  # Ejemplo de variables
│       ├── ansible/
│       │   └── playbook.yml       # Configuración de instancias
│       └── modules/
│           ├── network/           # Módulo de red
│           │   ├── main.tf
│           │   ├── variables.tf
│           │   └── outputs.tf
│           ├── compute/           # Módulo de cómputo
│           │   ├── main.tf
│           │   ├── variables.tf
│           │   └── outputs.tf
│           ├── storage/           # Módulo de almacenamiento
│           │   ├── main.tf
│           │   ├── variables.tf
│           │   └── outputs.tf
│           └── security/          # Módulo de seguridad
│               ├── main.tf
│               ├── variables.tf
│               └── outputs.tf
├── docs/
│   ├── architecture-diagram.png   # Diagrama de arquitectura
│   └── informe-tecnico.md         # Informe final
└── README.md
```

---

## 🚀 Requisitos Previos

### Herramientas Necesarias

- **Terraform** >= 1.5.0
- **AWS CLI** >= 2.0
- **Ansible** >= 2.9
- **TFLint** >= 0.47.0
- **Checkov** >= 2.3.0
- **Git** >= 2.30

### Instalación de Herramientas

#### En Linux/MacOS:

```bash
# Terraform
wget https://releases.hashicorp.com/terraform/1.5.7/terraform_1.5.7_linux_amd64.zip
unzip terraform_1.5.7_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# TFLint
curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash

# Checkov
pip3 install checkov

# Ansible
pip3 install ansible

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### En Windows (con Chocolatey):

```powershell
choco install terraform
choco install tflint
choco install awscli
pip install checkov ansible
```

---

## ⚙️ Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd <nombre-proyecto>
```

### 2. Configurar Credenciales AWS

```bash
aws configure
# AWS Access Key ID: TU_ACCESS_KEY
# AWS Secret Access Key: TU_SECRET_KEY
# Default region: us-east-1
# Default output format: json
```

### 3. Configurar Variables de Terraform

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Editar terraform.tfvars con tus valores
```

**Contenido de `terraform.tfvars`:**

```hcl
project_name = "iac-proyecto"
environment  = "dev"
aws_region   = "us-east-1"

# Network
vpc_cidr = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]

# Compute
instance_type = "t2.micro"
ami_id        = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2 en us-east-1

# Tags
tags = {
  Project     = "IaC-DevSecOps"
  ManagedBy   = "Terraform"
  Team        = "DevOps"
  Environment = "Development"
}
```

---

## 🔧 Uso del Proyecto

### Validación Local (Antes de Aplicar)

```bash
cd infra/terraform

# 1. Formatear código
terraform fmt -recursive

# 2. Validar sintaxis
terraform validate

# 3. Validar con TFLint
tflint --init
tflint

# 4. Escaneo de seguridad con Checkov
checkov -d . --compact --quiet
```

### Despliegue de Infraestructura

```bash
# Inicializar Terraform
terraform init

# Ver plan de ejecución
terraform plan -out=tfplan

# Aplicar cambios (requiere confirmación)
terraform apply tfplan

# Ver outputs
terraform output
```

### Destruir Infraestructura

```bash
terraform destroy
```

---

## 🔐 Medidas de Seguridad Implementadas

### 1. **Network Security**
- VPC aislada con subredes públicas y privadas
- NAT Gateway para tráfico saliente desde subredes privadas
- Network ACLs personalizadas

### 2. **Compute Security**
- Security Groups con reglas restrictivas (solo puertos específicos)
- IMDSv2 obligatorio en instancias EC2
- SSH key-based authentication
- No hay exposición directa 0.0.0.0/0 en puertos críticos

### 3. **Storage Security**
- Cifrado en reposo (AES-256) en S3
- Versionamiento habilitado
- Block Public Access activado
- Bucket policies con acceso restringido

### 4. **Identity and Access Management (IAM)**
- Roles con políticas de privilegios mínimos
- Políticas inline en lugar de managed cuando es posible
- Rotación de credenciales recomendada

### 5. **Secrets Management**
- Variables sensibles en AWS Systems Manager Parameter Store
- Uso de Ansible Vault para secretos
- `.tfvars` en `.gitignore`

### 6. **Compliance**
- Cumplimiento con CIS AWS Foundations Benchmark
- Validaciones OWASP IaC Security
- Escaneo continuo con Checkov

---

## 🔄 Pipeline CI/CD

El pipeline automatizado se ejecuta en cada push/PR e incluye:

### Etapas del Pipeline

1. **Lint:** Formato y validación de sintaxis
2. **Validate:** Validación de configuración Terraform
3. **Security Scan:** Escaneo con Checkov
4. **TFLint:** Análisis estático de código
5. **Plan:** Generación de plan de ejecución
6. **Apply:** Despliegue (manual approval, solo en main)

### Triggers

- **Push** a ramas: `main`, `develop`
- **Pull Requests** hacia `main`
- **Manual dispatch**

---

## 📊 Outputs del Proyecto

Después del despliegue, obtendrás:

```bash
vpc_id = "vpc-xxxxx"
public_subnet_ids = ["subnet-xxxx", "subnet-yyyy"]
private_subnet_ids = ["subnet-zzzz", "subnet-wwww"]
instance_id = "i-xxxxxxxxx"
instance_public_ip = "x.x.x.x"
s3_bucket_name = "iac-proyecto-storage-xxxxx"
security_group_id = "sg-xxxxxxx"
```

---

## 🧪 Pruebas y Validación

### Tests de Infraestructura

```bash
# Verificar conectividad a instancia
ssh -i ~/.ssh/terraform-key.pem ec2-user@<instance_public_ip>

# Verificar acceso a S3
aws s3 ls s3://<bucket-name>

# Validar Security Groups
aws ec2 describe-security-groups --group-ids <sg-id>
```

### Tests de Aplicación

```bash
cd app
npm install
npm test
```

---

## 📝 Documentación Adicional

- **Informe Técnico Completo:** `docs/informe-tecnico.md`
- **Diagrama de Arquitectura:** `docs/architecture-diagram.png`
- **Decisiones Técnicas:** Ver commits del repositorio

---

## 🎓 Lecciones Aprendidas

1. **Modularidad:** La separación en módulos facilita el mantenimiento y reutilización
2. **Seguridad desde el diseño:** Implementar controles de seguridad desde el inicio evita vulnerabilidades
3. **Automatización:** Los pipelines CI/CD reducen errores humanos y aceleran despliegues
4. **Validación continua:** Herramientas como Checkov detectan problemas antes del despliegue
5. **Documentación:** Una buena documentación es crucial para la colaboración del equipo

---

## 👥 Equipo del Proyecto

- **Integrante 1:** [Nombre] - [Rol]
- **Integrante 2:** [Nombre] - [Rol]
- **Integrante 3:** [Nombre] - [Rol]

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico para la asignatura de Infraestructura como Código.

---

## 🔗 Referencias

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Best Practices](https://aws.amazon.com/architecture/well-architected/)
- [CIS AWS Foundations Benchmark](https://www.cisecurity.org/benchmark/amazon_web_services)
- [OWASP IaC Security](https://owasp.org/www-project-infrastructure-as-code-security/)
- [Checkov Documentation](https://www.checkov.io/)