"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'


export default function Home({setPage}) {

  const [greeting, setGreeting] = useState();
  useEffect(() => {

    invoke('greet', { name: 'Welcome' })
      .then(result => setGreeting(result))
      .catch(console.error)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div className="flex flex-col items-center justify-between">
      <p className="text-4xl">DUNLIN</p>
      <div>Brought to you by RJson Devleopment</div>
      <div>{greeting}</div>
      <div />
      <div className="m-6">
        <button type="button" className="text-black bg-orange-400 hover:bg-orange-200 focus:ring-4 focus:ring-orange-500 font-medium rounded-lg text-sm px-7 py-1.5 me-2 mb-2" onClick={() => setPage("Goals")}>Goals</button>
        <button type="button" className="text-black bg-orange-400 hover:bg-orange-200 focus:ring-4 focus:ring-orange-500 font-medium rounded-lg text-sm px-7 py-1.5 me-2 mb-2" onClick={() => setPage("Todos")}>Todos</button>
      </div>
    </div>

    </main>
  );
}
