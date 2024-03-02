"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button, Input} from "@nextui-org/react";
import { v4 as uuidv4 } from 'uuid';

import { FaCheck, FaTrashAlt } from "react-icons/fa";

function addTodoItem(task, setTodoItems){
    invoke('add_todo_item', { id: String(uuidv4()), finished: 0, task:task, date:0})
      .then(result => {getTodoItems().then(setTodoItems)})
      .catch(console.error)
}

function removeTodoItem(id, setTodoItems){
    invoke('remove_todo_item', { id: id})
      .then(result => {getTodoItems().then(setTodoItems)})
      .catch(console.error)
}

function getTodoItems(){
  return invoke('get_todo_items');
}

export default function Todos({setPage}) {

  const [greeting, setGreeting] = useState();
  const [todoItems, setTodoItems] = useState([]);
  const [todoItemInput, setTodoItemInput] = useState("");

  useEffect(() =>
    {getTodoItems().then(setTodoItems);}, []
  )

// add min-h-screen to main; i took it out, but if it breaks down the line, that's why

  return (
    <main className="flex flex-col items-center justify-between m-24">
    <p className="text-xl py-5"><b>Todo List</b></p>
    <div>

      <div className="flex flex-col gap-5 w-[500px]">
      <Card className="flex flex-row gap-5 space-x-4">
        <CardHeader  className="justify-between">
            <div className="flex gap-5 border-default-200"></div>
            <Input
              placeholder="Todo Item..."
              labelPlacement="outside"
              onChange={(e) => setTodoItemInput(e.target.value)}
              value={todoItemInput}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                    {addTodoItem(todoItemInput, setTodoItems); setTodoItemInput("")}
              }}
            />
            <Button isIconOnly color="#fb923c" className="bg-orange-400" onClick={() => {addTodoItem(todoItemInput, setTodoItems); setTodoItemInput("")}}>+</Button>
        </CardHeader>
      </Card>
       {
         todoItems.map(i => {
           return(
             <Card className="gap-5">
               <CardHeader  className="justify-between">
                   <div className="flex gap-5 border-default-20 space-x-6"> {i.task}</div>
                   <div><Button isIconOnly color="#fb923c" className="" onClick={() => removeTodoItem(i.id, setTodoItems)}><FaTrashAlt/ ></Button></div>
               </CardHeader>
             </Card>
           )
         })
       }
      </div>

    </div>

    </main>
  );
}

function TodoItem({task, id}){
  return (<Card className="gap-5">
    <CardHeader  className="justify-between">
        <div className="flex gap-5 border-default-200">{task}</div>
        <Button isIconOnly color="#fb923c" className="">🗑️</Button>
    </CardHeader>
  </Card>)
}
