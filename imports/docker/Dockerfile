FROM danieldent/meteor:1.0.3.1-onbuild
MAINTAINER Anisha Keshavan <anishakeshavan@gmail.com>

USER root
RUN apt-get update
RUN apt-get install -y git

ENV MC_DIR /home/mindcontrol
RUN mkdir -p ${MC_DIR} &&\
		cd ${MC_DIR} &&\
		git clone https://github.com/clowd-control/mindcontrol.git ${MC_DIR}

WORKDIR ${MC_DIR}
ENTRYPOINT ["meteor"]
