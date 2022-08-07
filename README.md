# Github Container Registry

<p align="left" style="text-align:left;">
  <a href="https://www.githubuniverse.com/">
    <img alt="Github Universe" src="img/github-universe-2022.png" width="1040"/>
  </a>
</p>

## About this article

## Using Github Container Registry

### Local Environment

#### Authenticating to the Container registry

Setting your [ACCESS TOKEN](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries)

Save your PAT. We recommend saving your PAT as an environment variable.
```
export CR_PAT=YOUR_TOKEN
```

Using the CLI for your container type, sign in to the Container registry service at ```ghcr.io```.

```
$ echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
> Login Succeeded
```
#### Pushing container images

Build the image on this repo
```
docker build -t IMAGE_NAME .
```

Tag the image builded
```
docker tag IMAGE_ID ghcr.io/OWNER/IMAGE_NAME:TAG
```

```
docker push ghcr.io/jveraduran/OWNER/IMAGE_NAME:TAG
```

Working with Container Registry: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

## References

+ **Snyk:** https://github.com/snyk/actions
+ **Anchore:** https://github.com/anchore/scan-action
+ **Clair:** https://github.com/quay/clair
+ **Dockerlint:** https://github.com/marketplace/actions/dockerfile-validator
+ **Sbom:** https://github.com/anchore/sbom-action