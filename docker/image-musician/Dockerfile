FROM node:4.3.1
MAINTAINER Olivier Koffi <olivier.koffi@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY code /opt/app/

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/index.js"]

