"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'

import {NextUIProvider, Button, } from "@nextui-org/react";
import { getVersion } from '@tauri-apps/api/app';

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

function getStyleComponent(currentPage, name){
  if(currentPage===name){return "underline hover:no-underline hover:text-orange-500 text-orange-600 ";}
  else {return "underline hover:no-underline hover:text-orange-500";}

}


export default function DunlinNavbar({currentPage, setPage}) {

let [version, setVersion] = useState("")

useEffect(() => {getVersion().then(setVersion)}, [])


return (
<Navbar
  isBordered
>
   <NavbarBrand>
     <p className="font-bold text-inherit">{currentPage}</p>
   </NavbarBrand>

   <NavbarContent className="hidden sm:flex gap-4" justify="center">
     <NavbarItem>
       <Link color="foreground" className={getStyleComponent(currentPage, "Home")} href="#" onClick={() => setPage("Home")}>
         Home
       </Link>
     </NavbarItem>
     <NavbarItem>
       <Link color="foreground" className={getStyleComponent(currentPage, "Goals")} href="#" onClick={() => setPage("Goals")}>
         Goals
       </Link>
     </NavbarItem>
     <NavbarItem>
       <Link color="foreground" className={getStyleComponent(currentPage, "Todos")} href="#" onClick={() => setPage("Todos")}>
         Todos
       </Link>
     </NavbarItem>
     <NavbarItem>
       <Link color="foreground" className={getStyleComponent(currentPage, "Progress")} href="#" onClick={() => setPage("Progress")}>
         Progress
       </Link>
     </NavbarItem>
     <NavbarItem>
       <Link color="foreground" className={getStyleComponent(currentPage, "Journal")} href="#" onClick={() => setPage("Journal")}>
         Journal
       </Link>
     </NavbarItem>
   </NavbarContent>
   <NavbarContent justify="end">
     <NavbarItem className="lg:flex">
       <p className="font-bold text-inherit">V{version}</p>
     </NavbarItem>
   </NavbarContent>
 </Navbar>
)
}
