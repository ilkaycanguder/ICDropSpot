import os
from pathlib import Path
from dotenv import load_dotenv

ENV_PATH = (Path(__file__).resolve().parents[2] / ".env")  # ==> backend/.env
if os.path.exists(ENV_PATH): load_dotenv(ENV_PATH)
API_PORT = int(os.getenv("API_PORT", "8000"))
DATABASE_URL = os.getenv("DATABASE_URL", "")
print("CONFIG DATABASE_URL?", ("*"*8) if DATABASE_URL else "EMPTY")
