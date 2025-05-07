# CUDA

## locate cuda and add it to PATH

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
