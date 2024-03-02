"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'

import Home from './pages/home.js';
import Todos from './pages/todos.js';
import Goals from './pages/goals.js';
import Journal from './pages/journal.js';
import Progress from './pages/progress.js';

import DunlinNavbar from './navbar.js';
import React from 'react';
import {NextUIProvider, Button} from "@nextui-org/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/react";

import {Providers} from "./providers";

function getComponent(componentName, setPage) {
  if(componentName==="Home") return <Home setPage={setPage} />;
  if(componentName==="Goals") return <Goals setPage={setPage} />;
  if(componentName==="Todos") return <Todos setPage={setPage} />;
  if(componentName==="Journal") return <Journal setPage={setPage} />;
  if(componentName==="Progress") return <Progress setPage={setPage} />;
}
export default function Main() {
  const [greeting, setGreeting] = useState(0);
  const [currentPageName, setCurrentPageName] = useState("Home");
    useEffect(() => {
      invoke('greet', { name: 'Welcome to Dunlin' })
        .then(result => {setGreeting(result)})
        .catch(console.error)
    })

    return (
      <html lang="en" className='light'>
        <body>
        <Providers>

        <DunlinNavbar currentPage={currentPageName} setPage={setCurrentPageName} />

          <div className="flex min-h-screen flex-col items-center justify-between">
            {getComponent(currentPageName, setCurrentPageName)}
          </div>
        </Providers>
        </body>
      </html>
    );

}
