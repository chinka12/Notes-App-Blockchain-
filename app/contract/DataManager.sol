pragma solidity ^0.4.17;

//This contract is for registering insurance details of a person. Proof of Insurance
contract NoteApp {

        string noteId;
        struct note{
        string noteDescription;
        string noteDate; 
        string noteTime; 
        string active;
        
        }
    
    //This structure would be used to save policy details
    


//Indexed Mapping to keep a track and easy retrieval of policies
    mapping(string => note) notes;
    mapping(string => bool) isNoteAdded;


    event NoteEvent(string _actionPerformed, string _noteId, string _noteDescription, string _noteDate,string _noteTime, string _active, uint256 _timeOfTx);

    function addNote(string _noteId, string _noteDescription , string _noteDate, string _noteTime, string _active) {
        
        require(isNoteAdded[_noteId] == false);
        notes[_noteId].noteDescription = _noteDescription;
        notes[_noteId].noteDate = _noteDate;
        notes[_noteId].noteTime = _noteTime;
        notes[_noteId].active = _active;
        
      
        isNoteAdded[_noteId] = true;

        NoteEvent("NOTE ADDED", _noteId, _noteDescription, _noteDate, _noteTime, _active, now);
    }
    
   function updateNote(string _noteId, string _noteDescription , string _noteDate, string _noteTime, string _active) {
        
        require(isNoteAdded[_noteId] == true);
        notes[_noteId].noteDescription = _noteDescription;
        notes[_noteId].noteDate = _noteDate;
        notes[_noteId].noteTime = _noteTime;
        notes[_noteId].active = _active;
      

        NoteEvent("NOTE UPDATED", _noteId, _noteDescription, _noteDate, _noteTime, _active, now);
    }
   

    function getNote(string _noteId) returns(string, string, string, string) {

       return (notes[_noteId].noteDescription, notes[_noteId].noteDate, notes[_noteId].noteTime, notes[_noteId].active);
    }

    
}
