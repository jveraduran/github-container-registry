# Github Container Registry

<p align="left" style="text-align:left;">
  <a href="https://www.githubuniverse.com/">
    <img alt="Github Universe" src="img/github-universe-2022.png" width="1040"/>
  </a>
</p>

## About this article
<br>

## Using Github Container Registry - Local Environment

The Container registry stores container images within your organization or personal account, and allows you to associate an image with a repository. You can choose whether to inherit permissions from a repository, or set granular permissions independently of a repository. You can also access public container images anonymously.

<br>

### Authenticating to the Container registry
 <br>

1. Setting your [access token](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries), to enable GitHub functions like an OAuth access token and authenticates the access to the GitHub API. 
<br>

2. Save your PAT. We recommend saving your PAT as an environment variable
   
    ```
    export CR_PAT=YOUR_TOKEN
    ```
<br>

3. Using the CLI for your container type, sign in to the Container registry service at ```ghcr.io```.

    ```
    $ echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
    > Login Succeeded
    ```
 <br>

### Pushing container images
 <br>

After you are logged in, you can now tag and push your Docker image to the GitHub Container Registry

1. Build the image on this repo
   
    ```
    docker build -t IMAGE_NAME .
    ```

2. Tag the image builded
   
    ```
    docker tag IMAGE_ID ghcr.io/OWNER/IMAGE_NAME:TAG
    ```
3. Publish the image builded
   
    ```
    docker push ghcr.io/OWNER/IMAGE_NAME:TAG
    ```

Working with Container Registry: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

<br>

## Using Github Container Registry - Github Action
<br>

In a single workflow, you can publish your Docker image to multiple registries by using the ```login-action``` and `build-push-action` actions for each registry.

The following example workflow uses the steps from the previous sections [Publishing images to Docker Hub](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images#publishing-images-to-docker-hub) and [Publishing images to GitHub Packages](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images#publishing-images-to-github-packages) to create a single workflow that pushes to both registries.
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

To enable more capabilities and demostrate the strongest of Github and Github Actions we complement this example with [Github Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows) using Open Source Tools and Enterprise Tools on Actions.

Reusing workflows avoids duplication. This makes workflows easier to maintain and allows you to create new workflows more quickly by building on the work of others, just as you do with actions. Workflow reuse also promotes best practice by helping you to use workflows that are well designed, have already been tested, and have been proved to be effective. Your organization can build up a library of reusable workflows that can be centrally maintained.

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

## References

+ **Snyk:** https://github.com/snyk/actions
+ **Anchore:** https://github.com/anchore/scan-action
+ **Clair:** https://github.com/quay/clair
+ **Dockerlint:** https://github.com/marketplace/actions/dockerfile-validator
+ **Sbom:** https://github.com/anchore/sbom-action
+ **PrismaCloud:** https://github.com/PaloAltoNetworks/prisma-cloud-scan
+ **Trufflehog:** https://github.com/marketplace/actions/trufflehog-oss