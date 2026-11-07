"""Загрузка .env: значения попадают в окружение, заданные заранее не перезаписываются."""

import os

from app.env import load_env


def test_load_env(tmp_path, monkeypatch):
    f = tmp_path / ".env"
    f.write_text('# комментарий\n\nDEMO_A=one\nexport DEMO_B="two"\nDEMO_C=\nDEMO_D=keep\n', encoding="utf-8")
    monkeypatch.delenv("DEMO_A", raising=False)
    monkeypatch.delenv("DEMO_B", raising=False)
    monkeypatch.delenv("DEMO_C", raising=False)
    monkeypatch.setenv("DEMO_D", "already")
    assert load_env(f) == ["DEMO_A", "DEMO_B"]
    assert os.environ["DEMO_A"] == "one"
    assert os.environ["DEMO_B"] == "two"
    assert "DEMO_C" not in os.environ
    assert os.environ["DEMO_D"] == "already"


def test_missing_file(tmp_path):
    assert load_env(tmp_path / "nope") == []
