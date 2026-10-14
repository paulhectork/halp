# CUDA

## locate CUDA and add it to PATH

```bash
echo $CUDA_HOME  # if already defined, go to next step

# find CUDA version with (pay attention to version mismatches)
nvcc --version  # currently used cuda
nvidia-smi      # on the top-right, the highest supported cuda version

# cuda is usually in `/usr/local/cuda` or `/usr/lib/cuda`. we will go with `/usr/local/cuda`
# make sure to locate a cuda install with the same version as the one outputted `nvidia-smi`
cat /usr/local/cuda/version.json  # check for version of `"cuda"`

# set the proper cuda. 
# this will also update which `nvcc` is used (and the output of `nvcc --version`)
# add these to ~/.bashrc for consistency
export CUDA_HOME=/usr/local/cuda
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
```

## CUDA version mismatches

if several CUDA versions are installed on a machine, you may get this situation:

```bash
$ nvidia-smi
Failed to initialize NVML: Driver/library version mismatch
```

the easiest fix is a reboot:

```bash
sudo reboot
```

else, [this answer](https://stackoverflow.com/a/45319156) provides a reboot-free solution.

## install a new CUDA version and change CUDA version

you can have several different CUDA versions on your system.

### list available versions

```bash
# on the top-right, maximum CUDA version currently supported on your machine
nvidia-smi
# currently used CUDA
nvcc --version
# available CUDA versions on your machine
ls -d /usr/local/cuda*
```

### install a new version

On the internet, search for `cuda-toolkit-$majorversion-$minorversion`. Find `developer.nvidia.com`'s guide and follow instructions. 

On ubuntu 22.04 x86_64, here's how to install `cuda-toolkit-12.6`:

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-6

# check it was installed
ls -d /usr/local/cuda*
```

### change CUDA version

once the installation is successful, run the following commands (change the `12.6` by the version you want to use)

```bash
export CUDA_HOME=/usr/local/cuda-12.6
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
nvcc --version   # should now say 12.6
```

to make this CUDA version the default on your machine, add the `export` lines to your `~/.bashrc`

## reinstall Nvidia drivers

**NOTE: the CUDA toolkit we talk about above is DIFFERENT from the Nvidia drivers we talk about in this section**. 
drivers are responsible for direct interaction with GPUs, while the CUDA toolkit provides C librairies to code on GPU.

### base commands

if you need to (re)install Nvidia drivers on Ubuntu, brace yourself and run the commands:

```bash
# purge the previous 
sudo apt purge 'nvidia-*' 'libnvidia-*' 'libnvidia-*'
sudo apt autoremove

# reinstall
sudo dpkg --configure -a
sudo ubuntu-drivers install
sudo reboot
```

**after reinstalling, you will also need to install CUDA. see guide above**

### install a specific version

```bash
# list nvidia drivers that can be installed
sudo ubuntu-drivers list
# install nvidia drivers version 570
sudo apt install nvidia-driver-570
# finish installation
sudo reboot
# check that CUDA is available
nvidia-smi
```

**Notes**:
- the installed driver must **match your GPU model**
- **if `Secure Boot` is enabled on your Ubuntu**, you must install the drivers through `ubuntu-drivers` (not by downloading and building it yourself): 
    Canonical’s prebuilt modules are signed, but other builds will be blocked by the secure boot.
