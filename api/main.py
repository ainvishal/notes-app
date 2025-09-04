from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, Note as DBNote
from models import NoteCreate, Note
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://notes-app-u21i-km36618vh-vishal-aindalas-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up FastAPI application")
    try:
        db = next(get_db())
        db.execute("SELECT 1")  # Test DB connection
        logger.info("Database connection successful")
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise

@app.post("/notes/", response_model=Note)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    try:
        if not note.title or not note.content:
            raise HTTPException(status_code=400, detail="Invalid input")
        db_note = DBNote(title=note.title, content=note.content)
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        logger.info(f"Created note with id {db_note.id}")
        return db_note
    except Exception as e:
        logger.error(f"Error creating note: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/notes/", response_model=list[Note])
def read_notes(db: Session = Depends(get_db)):
    try:
        notes = db.query(DBNote).all()
        logger.info(f"Retrieved {len(notes)} notes")
        return notes
    except Exception as e:
        logger.error(f"Error reading notes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/notes/{note_id}", response_model=Note)
def read_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(DBNote).filter(DBNote.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: int, note: NoteCreate, db: Session = Depends(get_db)):
    try:
        if not note.title or not note.content:
            raise HTTPException(status_code=400, detail="Invalid input")
        db_note = db.query(DBNote).filter(DBNote.id == note_id).first()
        if db_note is None:
            raise HTTPException(status_code=404, detail="Note not found")
        db_note.title = note.title
        db_note.content = note.content
        db.commit()
        db.refresh(db_note)
        logger.info(f"Updated note with id {note_id}")
        return db_note
    except Exception as e:
        logger.error(f"Error updating note {note_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    try:
        db_note = db.query(DBNote).filter(DBNote.id == note_id).first()
        if db_note is None:
            raise HTTPException(status_code=404, detail="Note not found")
        db.delete(db_note)
        db.commit()
        logger.info(f"Deleted note with id {note_id}")
        return {"detail": "Note deleted"}
    except Exception as e:
        logger.error(f"Error deleting note {note_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")