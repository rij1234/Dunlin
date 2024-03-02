"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'


export default function Journal({setPage}) {

  const [greeting, setGreeting] = useState();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between m-24">
    <text>Journal Page</text>

    </main>
  );
}
