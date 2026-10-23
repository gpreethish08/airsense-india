"""
Vercel Serverless Function entrypoint for AirSense India
"""
import sys
import os

# Add parent directory to sys.path so services and modules can be resolved
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
