#!/bin/env groovy
pipeline {
    agent any
    environment {
        project = "${projectName}"
    }

    stages {
		//
        stage('项目编译') {
            steps {
                sh """
                    cd ${project} && 
                    docker run --rm --entrypoint='' -w /${project} -v `pwd`/:/${project} \
                    k8s-test-image.weimiaocaishang.com/base/nodejs-18.18.2:release_v2.7 \
                    sh -c "yarn && yarn build"
                    sh -c "cd ../ && tar -zcf ${project}.tar.gz ${project} && sudo rm -rf ${project}/*"
                    sh -c "sudo chown -R www:www ."
                """
			}
        }
		//
		stage('生成启动脚本entrypoint.sh') {
            steps {
        		sh '''
cat >entrypoint.sh <<EOF
#!/bin/bash
set -e
echo \\${POD_NAME} > /www/webroot/slbcheck/slbcheck.html
mkdir -p /data/{nginx,php}
chown -R www.www /data/{nginx,php} /www/webroot/${project}
cd /www/webroot/${project}
cp public/fonts/*  /usr/share/fonts/
fc-cache -fv
pm2 start ecosystem.config.js --env test
/usr/local/nginx/sbin/nginx -g 'daemon off;'
EOF
        		'''
			}
        }

        stage('生成Dockerfile') {
            steps {
        		sh '''
cat >Dockerfile <<EOF
FROM k8s-test-image.weimiaocaishang.com/base/nodejs-18.18.2:release_v2.7
COPY ${project}.tar.gz /www/webroot/
ADD entrypoint.sh /www/webroot/
RUN mkdir -p /www/webroot/slbcheck \
    && chmod +x /www/webroot/entrypoint.sh \
    && tar -zxf /www/webroot/${project}.tar.gz -C /www/webroot/ \
    && rm -f /www/webroot/${project}.tar.gz \
    && chown -R www.www /www/webroot/${project} \
    && echo ${project} > /www/webroot/slbcheck/slbcheck.html \
	&& yum -y install libdrm libgbm libxshmfence nss alsa-lib.x86_64 atk.x86_64 cups-libs.x86_64 gtk3.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXrandr.x86_64 libXScrnSaver.x86_64 libXtst.x86_64 pango.x86_64 xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-fonts-cyrillic xorg-x11-fonts-misc xorg-x11-fonts-Type1 xorg-x11-utils fontconfig \
	&& yum -y update nss
WORKDIR /data

STOPSIGNAL SIGQUIT

ENTRYPOINT ["/www/webroot/entrypoint.sh"]
EOF
        		'''
			}
        }
		//
        stage('生成镜像') {
            steps {
        		sh "sudo docker build -t k8s-test-image.weimiaocaishang.com/${harborProName}/${project}:${cq_node_api_version} ."
            }
        }
		//
        stage('上传到镜像仓库') {
            steps {
				withCredentials([usernamePassword(credentialsId: 'pushimage', passwordVariable: 'password', usernameVariable: 'username')]) {
					sh "sudo docker login -u $username -p $password k8s-test-image.weimiaocaishang.com && sudo docker push k8s-test-image.weimiaocaishang.com/${harborProName}/${project}:${cq_node_api_version}"
				}
            }
        }
		//
        stage('部署到k8s') {
            steps {
        		sh '''
name=${projectName}
version=${cq_node_api_version}
replicas_num=${replicas_num}
namespace=${k8sNamespace}
restart=${restart}
port=${CONTAINER_PORT}
limits_memory=${limits_memory}
harbor_proname=${harborProName}
requests_memory=${requests_memory}
domain_name=${deployHostName}
type=${type}
limits_cpu=${limits_cpu}
requests_cpu=${requests_cpu}

echo "++++++++++++++++Start deployment of services++++++++++++++++"
ser_name=${name}
app_name=${name}
echo ${ser_name}
echo "Start deploying production image"

mkdir -p /data/work/k8s/template-prod/${name} 
cp -rfa /data/work/k8s/template-prod/${type}-template/template-add-cpu2 /data/work/k8s/template-prod/${name}/template
[ $? -eq 0 ] && echo "Copy template succeeded" || { echo "Copy template failed";exit 1; }
/data/work/k8s/scripts/init-pub-${type}-add-cpu2.sh ${ser_name} ${version} ${replicas_num} ${namespace} ${restart} ${port} ${limits_memory} ${harbor_proname} ${app_name} ${requests_memory} ${domain_name} ${limits_cpu} ${requests_cpu}
[ $? -eq 0 ] && echo "Build configuration successful" || { echo "Build configuration failed";exit 1; }
cat /tmp/${namespace}-${app_name}
[ ! -e /data/work/k8s/project/${namespace}/${name} ] && mkdir -p /data/work/k8s/project/${namespace}/${name}
python /data/work/k8s/scripts/k8s-${type}-add-cpu2.py ${namespace} ${app_name} > /data/work/k8s/project/${namespace}/${name}/${namespace}-${name}.yaml
kubectl apply -f /data/work/k8s/project/${namespace}/${name}/${namespace}-${name}.yaml
[ $? -eq 0 ] && echo "++++++++Configuration updated successfully+++++++" || { echo "--------Configuration update failed--------";exit 1; }
echo  "Please wait for application deployment..................................."
sleep 10
kubectl get pod -o wide -n ${namespace}|grep ${ser_name}
fail=$(kubectl get pod -n ${namespace}|grep ${ser_name}|egrep "Error|exited|ImagePullBackOff|CrashLoopBackOff|ErrImagePull"|wc -l)
[ ${fail} -ge  1 ]  && { echo "--------@@@Online Failure@@@--------";exit 1; } || echo "++++++++Online successfully!!!+++++++"

				'''
            }
        }
		//
        stage('删除构建镜像') {
            steps {
        		sh "sudo docker rmi -f k8s-test-image.weimiaocaishang.com/${harborProName}/${project}:${cq_node_api_version}"
            }
        }
		//
    }
}