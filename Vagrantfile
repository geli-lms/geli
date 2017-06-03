# -*- mode: ruby -*-
# vi: set ft=ruby :

# FROM: http://thejackalofjavascript.com/vagrant-mean-box/

$npm_install_folders = "api;app/webFrontend"
$vagrant_sync_folder = "/vagrant"

if Vagrant::Util::Platform.windows?
  if not Vagrant::Util::Platform.windows_admin?
    puts "please run git bash as administrator, right click git bash and select 'Run as Administrator'"
    exit
  end
end

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "aeimer/mean-box"
  config.vm.box_version = ">= 0.3"
  
  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NodeJS-Web-Port
  config.vm.network "forwarded_port", id: "http", guest: 4200, host: 4200, host_ip: "127.0.0.1"
  # MongoDB-Database-Port
  config.vm.network "forwarded_port", id: "mongodb", guest: 27017, host: 27017, host_ip: "127.0.0.1"
  # MongoDB-Status-Page
  # config.vm.network "forwarded_port", id: "mongodb_status", guest: 28017, host: 28017, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", type: "dhcp"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # IF NFS CAUSES TROUBLE COMMENT THE "TYPE"-PARAM OUT
  # WINDOWS USER SHOULD INSTALL THE PLUGIN "vagrant-winnfsd"
  # config.vm.synced_folder ".", $vagrant_sync_folder, type: "nfs" # Comment this in to run with nfs
  config.vm.synced_folder ".", $vagrant_sync_folder

  # See https://github.com/npm/npm/issues/7308
  config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
  end

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-SHELL
    echo
    echo "## update dependency tree"
    sudo apt-get update -qq
    # sudo apt-get install -y
    # echo "## npm selfupdate"
    # sudo npm install --save selfupdate
  SHELL
  config.vm.provision "shell" do |f|
    f.inline = <<-SCRIPT
        for FOLDER in $(echo $2 | tr ";" "\n")
        do
	    echo
            echo "## installing npm dependencies in folder '$FOLDER'"
            cd $1
            cd $FOLDER
            sudo npm install
        done
    SCRIPT
    f.args = [$vagrant_sync_folder, $npm_install_folders]
  end
end
