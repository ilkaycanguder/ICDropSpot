import hashlib, subprocess, pathlib

root = pathlib.Path(__file__).resolve().parents[1]

def sh(args):
    return subprocess.check_output(args, cwd=root, text=True).strip()

start  = (root/"tools"/"seed_start.txt").read_text().strip()
remote = sh(["git", "config", "--get", "remote.origin.url"])

# İlk commit hash'ini al → sonra epoch'unu çek
first_hash = sh(["git", "rev-list", "--max-parents=0", "HEAD"]).splitlines()[0]
epoch = sh(["git", "show", "-s", "--format=%ct", first_hash])

raw  = f"{remote}|{epoch}|{start}"
seed = hashlib.sha256(raw.encode()).hexdigest()[:12]

A = 7  + (int(seed[0:2],16) % 5)
B = 13 + (int(seed[2:4],16) % 7)
C = 3  + (int(seed[4:6],16) % 3)

(root/"tools"/"seed.txt").write_text(seed + "\n")

print("remote:", remote)
print("first_commit_hash:", first_hash)
print("first_commit_epoch:", epoch)
print("start_time:", start)
print("seed:", seed)
print("A,B,C:", A, B, C)
