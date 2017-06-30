# visualizer

visualize the gaming data from arena I/O

## install 

```bash
$ docker build . -t visualizer
```

## run

```bash
$ docker run --rm --name visualizer -v /some/content:/usr/share/nginx/html:ro -d nginx
```
