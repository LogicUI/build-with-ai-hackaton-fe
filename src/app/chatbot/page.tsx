'use client'
import { useState, useMemo } from "react";
import { LoginCircleSVG, HopeIconSVG } from "../assets/assets";
import Image from "next/image";
import WithAuth from "../HOC/WithAuth";
import { useChatBot } from "../hooks/useChatBot";
import { BounceLoader } from 'react-spinners';

type Message = {
    sender: string,
    text: string
}


const ChatComponent = () => {
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [input, setInput] = useState("");
    const { handleStreamAiPrompt,
        handleResetConvoSession,
        handleUpdateConvoSession,
        historyTexts,
        saveConvoEntires } = useChatBot()


    useMemo(() => {
        const newHistoryTexts: Array<Message> = []
        historyTexts?.conversation_history.forEach((history: { user: string, therapist: string }) => {
            newHistoryTexts.push({ sender: "user:", text: history.user }, { sender: "therapist", text: history.therapist })
        });
        setMessages(newHistoryTexts)
    }, [historyTexts])


    const transformMessages = (messages: Array<Message>): Array<{
        user: string;
        therapist: string;
    }> => {
        const result: Array<{
            user: string;
            therapist: string;
        }> = [];
        let currentMessage: { user: string, therapist: string } = { user: "", therapist: "" };

        messages.forEach(({ sender, text }: Message) => {
            if (sender === "user:") {
                currentMessage["user"] = text || "";
            } else if (sender === "therapist") {
                currentMessage["therapist"] = text;
                result.push({ ...currentMessage });
                currentMessage = { user: "", therapist: "" };
            }
        });

        return result;
    }

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessages = [...messages, { sender: 'user:', text: input }];

            newMessages.push({ sender: 'therapist', text: '' });
            setMessages(newMessages);

            const conversationHistory = transformMessages(newMessages);

            const response = await handleStreamAiPrompt(input, conversationHistory, (chunk) => {
                setMessages((prev) => {
                    const copy = [...prev];
                    const lastIndex = copy.length - 1;
                    if (lastIndex >= 0 && copy[lastIndex].sender === 'therapist') {
                        copy[lastIndex] = {
                            ...copy[lastIndex],
                            text: copy[lastIndex].text + chunk,
                        };
                    }
                    return copy;
                });
            })

            const updatedMessage = [...messages, { sender: 'user:', text: input }, { sender: 'therapist', text: response }];
            await handleUpdateConvoSession(transformMessages(updatedMessage));
            setInput('');
        }
    };

    const handleConvoEntries = () => {
        const conversationHistory = transformMessages(messages)
        saveConvoEntires(conversationHistory)
    }

    return (
        <div className="bg-dark text-white min-h-screen flex justify-center px-4 sm:px-6 lg:px-8 mt-20">
            <div className="md:w-9/12 w-full bg-dark rounded-lg p-6 space-y-4">

                {messages.length === 0 ? (
                    <div className="text-center">
                        <h1 className="text-5xl font-bold">Hey there! 👋</h1>
                        <p className="mt-5 text-2xl text-gray-300">
                            I'm your friendly buddy, here to make life easier—answering
                            questions, solving problems, or chatting about your ideas.
                        </p>
                        <p className="mt-5 text-gray-300">
                            Think of me as your smart, supportive sidekick. Let’s dive in
                            together!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.sender === 'user:' ? 'justify-end' : 'justify-start'}`}>
                                <div>
                                    <div className="flex justify-end">
                                        <strong className="text-sm text-gray-400">{message.sender === 'user:' && 'You:'}</strong>
                                    </div>
                                    {message.sender === 'therapist' && (
                                        <div className="flex justify-start mt-3 ml-3">
                                            <strong className="text-sm text-gray-400">
                                                <Image
                                                    src={HopeIconSVG}
                                                    alt="icon"
                                                />
                                            </strong>
                                        </div>)}
                                    <div className={`${message.sender === "user:" ? "bg-message bg-opacity-50" : ""} text-white p-4 mt-2 rounded-lg`}>
                                        <div>{message.text}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="w-full p-4 bg-dark pt-[20rem]">
                    <div className="flex w-full relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Message HopeLog"
                            rows={5}
                            className="flex-grow bg-message text-white border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <button
                            onClick={sendMessage}
                            className="absolute bottom-2 right-2 bg-transparent border-none cursor-pointer"
                        >
                            <Image
                                src={LoginCircleSVG}
                                alt="icon"
                            />
                        </button>
                    </div>
                    <div className="mt-4 w-full">
                        <button
                            onClick={handleResetConvoSession}
                            className="bg-yellow-500 text-white px-6 py-2 rounded-lg w-full"
                        >
                            Refresh Convo
                        </button>
                    </div>
                    <div className="mt-4 w-full">
                        <button
                            onClick={handleConvoEntries}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full"
                        >
                            Finish Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default WithAuth(ChatComponent) 