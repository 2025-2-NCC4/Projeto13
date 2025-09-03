from . import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # sales, profit, users
    data = db.Column(db.JSON, nullable=False)
    period = db.Column(db.String(50), nullable=False)  # daily, weekly, monthly
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'data': self.data,
            'period': self.period,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat()
        }