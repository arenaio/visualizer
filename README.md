# visualizer

visualize the gaming data from arena I/O

## install 

```bash
$ docker build . -t visualizer
```

## run

```bash
$ docker run -p 8080:80 --rm --name visualizer -v $(pwd)/dist:/usr/share/nginx/html:ro -d nginx
```
