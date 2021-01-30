import { Avatar } from '@material-ui/core'
import { InsertEmoticon, Mic } from '@material-ui/icons'
import React, { useState, useContext } from 'react';
import { AuthContext } from "../../Context/AuthContext";
import { RoomContext } from "../../Context/RoomContext";
import axios from "axios";
import './Chat.css';
// Messages is provided as a props, so we need to retrieve it via props and then destructure messages out of props
function Chat(props) {
    const roomContext = useContext(RoomContext);
    const { messages, chatroomName } = props;
    const [input, setInput] = useState("");
    const authContext = useContext(AuthContext);

    // const lastSeen = messages[messages.length - 1].timeStamp;

    const sendMessage = async (event) => {
        event.preventDefault();
        const currentTime = new Date().toUTCString();
        //Send the input as message using axios
        await axios.post('/api/messages', {
            message: input,
            name: authContext.user.username,
            timeStamp: currentTime,
            senderID: authContext.user._id,
            chatroomID: roomContext.currentRoomID
        });
        //Now, run parent function to get the messages again and render messages again.
        props.handlePusher();
        //props.getMessages();
        //Once axios has completed, set the input back to blank
        setInput("");
    }


    return (
        <div className='chat'>
            <div className="chat_header">
                <Avatar />
                <div className='chat_headerInfo'>
                    <h3>{chatroomName}</h3>
                    <p>Last message sent: </p>
                </div>
            </div>

            <div className='chat_body' id='chat_body'>
                {/* Here we loop through messages and create a new chat bubble for each message. if the .recieved is true,
                 the bubble will be given the className 'chat_reciever' for different styling*/}
                {messages.map((message, index) => (
                    <>
                        <p key={index} className={`chat_message ${message.senderID === authContext.user._id ? "chat_reciever" : ""}`}>
                        <span className='chat_name'>{message.name}</span>
                        {message.message}
                        <span className='chat_timestamp'> 
                            {message.timeStamp}
                        </span>
                        </p>
                    </>
                ))
                }
            </div>

            <div className="chat_footer">
                <InsertEmoticon />
                <form>
                    {/* The value will be set to the state "input" 
                        and every time the input is changed, we will set the
                        new information to input using setInput */}
                    <input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        placeholder='Type a message' type="text" 
                    />
                    <button onClick={sendMessage} type='submit'>
                            Send a message
                    </button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat