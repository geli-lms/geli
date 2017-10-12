# Running with Vagrant

To use Vagrant for the development download VirtualBox, install it and then do the same with vagrant.
After that open the e.g. `git bash` __AS ADMIN__ and go to the project root. Now run `vagrant up`.

After everything is installed and all npm dependencies are downloaded you can connect to the VirtualBox
via `vagrant ssh`. The Ports 4200 and 27017 are forwarded to your host system. Just type `localhost:4200` in your
browser and you will (almost) see your local geli-instance.

I would suggest you the following plugins for vagrant, to install plugins run `vagrant plugin install [packagename]`:
- vagrant-vbguest
  - This plugins installs automaticalyl the correct virtualbox-guest-addition on your guest-system
- vagrant-winnfsd
  - This plugin enables NFS-mounting for windows systems, which will speed up the filesysystem a lot!
- vagrant-netinfo
  - This plugin can be handy if you want to see all forwarded ports of a box

In the `Vagrantfile` the nfs mount can be enabled, this can cause problems (eg permission errors on npm install). If you have problems undo the commenting switch in the `Vagrantfile` and `vagrant reload` your box.

## Start services

To start the __backend__ ssh into the VM with `vagrant ssh` and run the following lines. This will lint and compile the code, aswell start the api-webserver.

    cd api
    npm run start

To start the __frontend__ ssh into VM with a __second__ shell (`vagrant ssh`) and run the following commands. This will lint and compile the code, aswell start the frontend-develop-webserver.

    cd app/webFrontend
    npm run start-vagrant-dev
