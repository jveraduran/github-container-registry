# Github Container Registry

## Acerca de este artículo

[GitHub](https://github.com/features) con [GitHubActions](https://github.com/features/actions) y [GitHub Advanced Security](https://docs.github.com/es/get-started/learning-about-github/about-github-advanced-security) ofrecen una excelente experiencia para los desarrolladores alrededor del planeta. Solo con algunas pequeñas consideraciones y buenas ideas, podremos crear una experiencia maravillosa para nuestros equipos de desarrollo, y ellos literalmente **solo se enfocarán en desarrollar**

Con [GitHub Packages](https://github.com/features/packages), podemos publicar y consumir paquetes de forma segura dentro de nuestras organizaciones o con todo el mundo.

### **Publicación simple** 
Puedes usar industry y community-standard administradores de packages con herramientas de comandos nativa. Luego, podrás mediante autenticación nativa de GitHub podras publicar tus packages.
<img alt="Github Universe" src="https://user-images.githubusercontent.com/51175225/187101577-5042a584-65c0-40c3-96b5-5312deeba6b2.png" height="20"/>
<img alt="Github Universe" src="https://user-images.githubusercontent.com/51175225/187101798-0075567d-fc30-4b0c-b9eb-fb26121382e8.png" height="20"/>
<img alt="Github Universe" src="https://user-images.githubusercontent.com/51175225/187101908-3d597389-cc7a-43e2-b4b1-0cef947915aa.png" height="20"/>
<img alt="Github Universe" src="https://user-images.githubusercontent.com/51175225/187101966-0f3259f1-0134-4414-ab4f-ba9087cd18c8.png" height="20"/>
<img alt="Github Universe" src="https://user-images.githubusercontent.com/51175225/187102003-514489fb-6dec-445e-90de-6c498e779f46.png" height="20"/>
<img alt="Github Universe" src="https://user-images.githubusercontent.com/51175225/187102024-1ad5cf3a-16e9-4388-aed8-f36c9986135c.png" height="20"/>


### **Fuentes Verificadas** 
Comprender e instalar de forma segura el contenido del paquete. Obtenga paquetes directamente de la comunidad en GitHub y use solo lo que ha sido aprobado para su organización.

### **Rápido y seguro, nativo para GitHub**

- **Use el mismo inicio de sesión seguro para su código y paquetes:** Almacene sus paquetes en el mismo entorno seguro que su código fuente, todo protegido por sus credenciales de GitHub.

- **Integre paquetes con sus workflow:** Con una API completa y compatibilidad con webhooks, puede ampliar sus workflow para trabajar con paquetes de GitHub.


- **Obtenga descargas rápidas y confiables a través de un CDN global:** GitHub Packages está construido con el último almacenamiento en caché perimetral a través de un CDN global para ofrecer un gran rendimiento, sin importar dónde se ejecuten sus compilaciones.

## Usando Github Container Registry - Ambiente Local

GitHub Container Registry almacena imágenes de contenedores dentro de su organización o cuenta personal y le permite asociar una imagen con un repositorio. Puedes elegir si deseas heredar los permisos de un repositorio o establecer permisos granulares independientemente de un repositorio. También puedes acceder a imágenes de contenedores públicos de forma anónima.


### Autenticándonos en GitHub Container registry

1. Configura tu [access token](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries), para habilitar funciones de GitHub como OAuth Access token y autenticación para acceder a GitHub API. 

    + Selecciona ```read:packages``` para descargar imágenes de contenedores y leer sus metadatos.
    
    + Selecciona ```write:packages``` para descargar y cargar imágenes de contenedores y para leer y escribir sus metadatos
    
    + Selecciona ```delete:packages``` para borrar imágenes de contenedores.

2. Graba tu PAT. Te recomiendio almacenar tu PAT acomo una variable de entorno
   
    ```
    export CR_PAT=YOUR_TOKEN
    ```

3. Usando CLI para tu tipo de contenedor, realizaremos un login en el servico de GitHub Container registry ```ghcr.io```.

    ```
    $ echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
    > Login Succeeded
    ```

### Publicando en GitHub Container Registry

Después de iniciar sesión, ahora puedrás etiquetar y enviar tu imagen de Docker hacia GitHub Container Registry

1. Compila la imagen de este repositorio (o la que quieras)
   
    ```
    docker build -t IMAGE_NAME .
    ```

2. Etiqueta la imagen compilada
   
    ```
    docker tag IMAGE_ID ghcr.io/OWNER/IMAGE_NAME:TAG
    ```

3. Publica la imagen compilada
   
    ```
    docker push ghcr.io/OWNER/IMAGE_NAME:TAG
    ```

Para descubrir todas las formas de trabajar con [Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) o de otra manera, te invito a generar un [**ISSUE**](https://github.com/jveraduran/github-container-registry/issues) y con gusto lo contesto.

<br>

## Usando Github Container Registry - Github Actions
<br>

En un solo workflow, puedes publicar tu imagen de Docker en varios registros mediante el ```login-action``` y `build-push-action` actions para cada registry.

El siguiente workflow de ejemplo utiliza los pasos de las secciones anteriores [Publishing images to Docker Hub](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images#publishing-images-to-docker-hub) y [Publishing images to GitHub Packages](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images#publishing-images-to-github-packages) para crear un único workflow que publique en ambos registries.
<br>
```
name: Create and publish a Docker image
on:
  release:
    types: [published]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push-image:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to the Container registry
        uses: docker/login-action@f054a8b539a109f9f41c372932f1ae047eff08c9
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.PAT_GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@98669ae865ea3cffbcbaa878cf57c20bbf1c6c38
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      - name: Build and push Docker image
        uses: docker/build-push-action@ad44023a93711e3deb337508980b4b5e9bcdc5dc
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Para habilitar más capacidades y demostrar lo más potente de Github y Github Actions, complementamos este ejemplo con [Github Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows) usando herramientas Open Source y Enterprise Tools mediante GitHub Actions.

La reutilización de workflows evita la duplicación. Esto hace que los workflow sean más fáciles de mantener y te permiten crear nuevos workflow más rápidamente basándose en el trabajo de otros, tal como lo hace con las acciones. La reutilización de workflows también promueve las mejores prácticas ayudándote a usar workflows que están bien diseñados, ya se han probado y se ha demostrado que son efectivos. Tu organización puede crear una biblioteca de workflows reutilizables que se pueden mantener de forma centralizada.

**Note:** Para habilitar sus GitHub Actions, en algunos casos debe configurar [Secretos cifrados](https://docs.github.com/es/enterprise-cloud@latest/actions/security-guides/encrypted-secrets)

<br>

```
name: Github Container Registry
on:
  pull_request: 
    branches: [develop, staging, master]
    types: [opened, synchronize]
  release:
    types: [published]

jobs:
  Action-Linter:
    if: github.event_name != 'opened'
    uses: ./.github/workflows/action-linter.yml

  Trufflehog:
    if: github.event_name != 'opened'
    uses: ./.github/workflows/trufflehog.yml
    needs: [Action-Linter]

  Docker-Linter:
    if: github.event_name != 'opened'
    uses: ./.github/workflows/docker-linter.yml
    needs: [Action-Linter]

  Security-Anchore:
    if: github.event_name != 'opened'
    uses: ./.github/workflows/anchore.yml
    needs: [Trufflehog, Action-Linter, Docker-Linter]
  
  Security-Snyk:
    if: github.event_name != 'opened'
    uses: ./.github/workflows/snyk.yml
    needs: [Action-Linter, Docker-Linter]
    secrets:
      SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  
  Security-Prisma:
    if: github.event_name != 'opened'
    uses: ./.github/workflows/PrismaCloud.yml
    needs: [Action-Linter, Docker-Linter]
    secrets:
      pcc_console_url: ${{ secrets.PCC_CONSOLE_URL }}
      pcc_user: ${{ secrets.PCC_USER }}
      pcc_pass: ${{ secrets.PCC_PASS }}
  
  Docker-SBOM:
    if: github.event_name != 'opened'
    uses: ./.github/workflows/docker-sbom.yml
    needs: [Security-Anchore, Security-Snyk]
  
  Registry:
    if: ${{ (github.event.release.action == 'released') && always() }}
    uses: ./.github/workflows/registry.yml
    needs: [Docker-SBOM, Security-Anchore, Security-Snyk]
    secrets:
      PAT_GITHUB_TOKEN: ${{ secrets.PAT_GITHUB_TOKEN }}
```
<br>


## Referencias

+ **Snyk:** https://github.com/snyk/actions
+ **Anchore:** https://github.com/anchore/scan-action
+ **Clair:** https://github.com/quay/clair
+ **Dockerlint:** https://github.com/marketplace/actions/dockerfile-validator
+ **Sbom:** https://github.com/anchore/sbom-action
+ **PrismaCloud:** https://github.com/PaloAltoNetworks/prisma-cloud-scan
+ **Trufflehog:** https://github.com/marketplace/actions/trufflehog-oss
+ **Trivy:** https://github.com/aquasecurity/trivy-action
