from sqlalchemy import Column, Integer, String, Text, Float, Enum, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    telegram_chat_id = Column(String(100))
    created_at = Column(TIMESTAMP, server_default=func.now())
    criteria = relationship("Criteria", back_populates="user")

class Source(Base):
    __tablename__ = "sources"
    id = Column(Integer, primary_key=True)
    type = Column(Enum("reddit","facebook","discord","forum"), nullable=False)
    name = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    active = Column(Integer, default=1)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Criteria(Base):
    __tablename__ = "criteria"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    label = Column(String(255), nullable=False)
    description_naturelle = Column(Text, nullable=False)
    active = Column(Integer, default=1)
    created_at = Column(TIMESTAMP, server_default=func.now())
    user = relationship("User", back_populates="criteria")

class PostDetected(Base):
    __tablename__ = "posts_detected"
    id = Column(Integer, primary_key=True)
    source_id = Column(Integer, ForeignKey("sources.id"))
    criteria_id = Column(Integer, ForeignKey("criteria.id"))
    title = Column(String(500))
    content = Column(Text)
    url = Column(String(1000))
    score_pertinence = Column(Float, default=0)
    notified = Column(Integer, default=0)
    detected_at = Column(TIMESTAMP, server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts_detected.id"))
    channel = Column(Enum("telegram","email"), nullable=False)
    sent_at = Column(TIMESTAMP, server_default=func.now())
