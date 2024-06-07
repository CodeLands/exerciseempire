# Machine
3770k \
32GB RAM \
GTX 780 TI 

## OS
Ubuntu Server 24.04

### Credentials
domain: exerciseempire.ddns.net \
ssh_port: 42000 \
user: administrator \
password: exerciseempire123!?. 

#### Warning
DO NOT shutdown if you are in ssh \
FAILSAFE server auto-restarts every day at 7AM and after power regain if power loss 

##### Commands
Access server: \
ssh administrator@exerciseempire.ddns.net -p 42000 

Generate keys: \
ssh-keygen -t rsa -b 4096

Copy keys for paswordless: \
ssh-copy-id -p 42000 administrator@exerciseempire.ddns.net
