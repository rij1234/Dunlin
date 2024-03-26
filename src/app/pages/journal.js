"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import {Textarea, Button, Divider} from "@nextui-org/react";


export default function Journal({setPage}) {

  const [calendarValue, setCalendarValue] = useState( new Date() );
  const [journalEntryInputValue, setJournalEntryInputValue] = useState("");
  const [journalEntryViewerValue, setJournalEntryViewerValue] = useState("");


  function setJournal(date, entry) {
    invoke('set_journal', {date: date, entry: entry})
      .then(e => {
        setCalendarValue(new Date());
        setJournalEntryViewerValue(entry)
      })
  }
  
  // Gets journal of specific date from the database and gives it to the viewer (under the calendar)
  function getJournal(date) {
    return invoke('get_journal', {date: date}).then(e => {
      console.log(e); 
      setJournalEntryViewerValue(e[0]);
    });
  }


  useEffect( () => {
    getJournal(`${calendarValue.getFullYear()}/${calendarValue.getMonth()}/${calendarValue.getDate()}`);
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center py-5">


      <div className="space-y-6  mb-5 text-xl py-5"><b>Journal</b></div>
      <Divider className="my-4" />

      <div className="w-[450px] pb-5">
        <Textarea
            variant="bordered"
            label={new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', })}
            labelPlacement="outside"
            placeholder="Today's Journal Entry Here"  
            className="w-[450px] py-2" 
            onChange={(e) => setJournalEntryInputValue(e.target.value)}
            value={journalEntryInputValue}
          />
          
          <Button  isDisabled={journalEntryInputValue === ""} color="#fb923c" className="bg-orange-400" onClick={() => {
            let today = new Date();
            setJournal(`${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`, journalEntryInputValue)
          }}>Save</Button>         

      </div>

      <Divider className="my-3" />

      <div className="mb-5 text-lg pt-8">View Journal Entries</div>

      <div className="pb-5">
        <Calendar 
            onChange={calendarValue => {
              getJournal(`${calendarValue.getFullYear()}/${calendarValue.getMonth()}/${calendarValue.getDate()}`);
              setCalendarValue(calendarValue);
              } 
            }
            value={calendarValue} 
        /> 
      </div>

      <div className="space-y-6  mb-5 text-l py-5"><b>Journal for {new Date().toLocaleString(
        undefined,
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      )}</b></div>
      <div className="w-[450px] min-h-[500px] border-2 py-2">
        <div className="mx-3 my-2">{journalEntryViewerValue}</div>
      </div>
    </main>
  );
}
