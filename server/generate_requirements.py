import json

with open("Pipfile.lock") as f:
    lock_data = json.load(f)

def convert_section(section):
    return [
        f"{pkg}{'==' + info['version'].lstrip('=') if 'version' in info else ''}"
        for pkg, info in lock_data.get(section, {}).items()
    ]

default_packages = convert_section("default")
dev_packages = convert_section("develop")

with open("requirements.txt", "w") as req_file:
    req_file.write("\n".join(default_packages) + "\n")

with open("dev-requirements.txt", "w") as dev_file:
    dev_file.write("\n".join(dev_packages) + "\n")

print("✅ requirements.txt and dev-requirements.txt generated.")
