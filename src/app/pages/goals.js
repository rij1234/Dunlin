"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, Route } from 'react';
import { invoke } from '@tauri-apps/api/tauri'

import {Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Tooltip, Divider, Card, CardHeader, CardBody, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { FaInfoCircle } from "react-icons/fa";

import { v4 as uuidv4 } from 'uuid';

import { FaCheck, FaTrashAlt, FaPlus, FaMinus} from "react-icons/fa";
import { FaCirclePlus,  } from "react-icons/fa6";


function createGoal({updateGoals, close, longTermGoal, onePointrequirement, twoPointRequirement, threePointRequirement}){
  invoke('add_goal', {
    id: String(uuidv4()),
    goal: String(longTermGoal),
    onePointrequirement: String(onePointrequirement),
    twoPointRequirement: twoPointRequirement,
    threePointRequirement: threePointRequirement,
    pointsCompletedToday: 0,
    lastCompleted: -1
  }).then(close).then(getGoals().then(updateGoals))
}

function removeGoal(updateGoals, id) {
  invoke("remove_goal", {
    id: String(id)
  }).then(getGoals().then(updateGoals))
}

function setPoints(updateGoals, id, newPointTotal) {
  if(newPointTotal >= 0 && newPointTotal <= 3) {
    invoke('update_goal', {
      id: id,
      pointsCompletedToday: newPointTotal,
      lastCompleted: Number((new Date()).getTime())
    }).then(getGoals().then(updateGoals))
  }
}

function updateGoalTotal(d){
    let today = new Date();
    let sumOfPointsCompletedToday = 0;
    d.forEach(i => {

      const lastCompleted = new Date(i.lastCompleted);
      const today = new Date();

      if (
        lastCompleted.getFullYear() !== today.getFullYear() ||
        lastCompleted.getMonth() !== today.getMonth() ||
        lastCompleted.getDate() !== today.getDate()
      ) {
        i.pointsCompletedToday = 0;
      }

      sumOfPointsCompletedToday += i.pointsCompletedToday
    })
    invoke('set_daily_points', {date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`, pointsCompleted: sumOfPointsCompletedToday})
}

function getGoals(){
  let p = invoke('get_goals');
  p.then(updateGoalTotal);
  return p;
}


export default function Goals({setPage}) {

  const [greeting, setGreeting] = useState();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [longTermGoal, setLongTermGoal] = useState('');
  const [onePointRequirement, setOnePointrequirement] = useState('');
  const [twoPointRequirement, setTwoPointrequirement] = useState('');
  const [threePointRequirement, setThreePointrequirement] = useState('');

  const [goals, setGoals] = useState([]);

  useEffect(() =>
    {getGoals().then(setGoals);}, []
  );

  let totalPointsCompleted = 0;
  goals.forEach(x => totalPointsCompleted += x.pointsCompletedToday)
  let percentComplete = (totalPointsCompleted / (goals.length * 3)) * 100

  return (
    <main className="flex flex-col items-center justify-between">

      <div className="flex gap-5 justify-between pt-5 w-[600px]">
        <div className="space-y-6 text-xl py-5"><b>Goals</b></div>
        <Button onPress={onOpen} isIconOnly color="warning"><FaPlus /></Button>
      </div>

      <Progress
        label={`${Math.round(percentComplete * 100) / 100}% Complete`}
        value={percentComplete}
        color="success"
        showValueLabel={false}
        className="w-[600px] pb-5"
      />

      <div>
        {
          goals.map(g => {
            // console.log(g);
            const lastCompleted = new Date(g.lastCompleted);
            const today = new Date();
            if (
              lastCompleted.getFullYear() !== today.getFullYear() ||
              lastCompleted.getMonth() !== today.getMonth() ||
              lastCompleted.getDate() !== today.getDate()
            ) {
              g.pointsCompletedToday = 0;
            }
            return (

                <div className="py-2 flex gap-5 border-default-20">
                  <Card className="w-[600px]">
                    <CardHeader className="flex gap-3 justify-between">
                      <div className="flex flex-col">
                        <p className="text-lg"><b>{g.goal}</b></p>
                      </div>
                      <div className="space-x-2">
                        <Button isIconOnly onClick={() => setPoints(setGoals, g.id, g.pointsCompletedToday - 1)}><FaMinus /></Button>
                        <Button isIconOnly onClick={() => setPoints(setGoals, g.id, g.pointsCompletedToday + 1)}><FaPlus /></Button>
                        <Button isIconOnly onClick={() => removeGoal(setGoals, g.id)}><FaTrashAlt /></Button>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <p><Checkbox color="success" onClick={() => g.pointsCompletedToday != 1 ? setPoints(setGoals, g.id, 1) : setPoints(setGoals, g.id, 0)} icon={<FaPlus />} isSelected={g.pointsCompletedToday >= 1}></Checkbox><b>One Point:</b> {g.onePointRequirement}</p>
                      <p><Checkbox color="success" onClick={() => g.pointsCompletedToday != 2 ? setPoints(setGoals, g.id, 2) : setPoints(setGoals, g.id, 1)} icon={<FaPlus />} isSelected={g.pointsCompletedToday >= 2}></Checkbox><b>Two Points:</b> {g.twoPointRequirement}</p>
                      <p><Checkbox color="success" onClick={() => g.pointsCompletedToday != 3 ? setPoints(setGoals, g.id, 3) : setPoints(setGoals, g.id, 2)} icon={<FaPlus />} isSelected={g.pointsCompletedToday >= 3}></Checkbox><b>Three Points:</b> {g.threePointRequirement}</p>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <div className="flex flex-row">
                        Last Completed: {g.lastCompleted===-1 ? "N/A" : `${lastCompleted.getMonth() + 1}/${lastCompleted.getDate()}/${lastCompleted.getFullYear()}`}
                      </div>
                    </CardFooter>
                  </Card>
                </div>
            )
          })
        }
      </div>


      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Goal</ModalHeader>
              <ModalBody>
              <Divider className="my-2" />
                <Input
                  autoFocus
                  label="Long Term Goal"
                  placeholder="..."
                  variant="bordered"
                  value={longTermGoal}
                  onChange={e => setLongTermGoal(e.target.value)}
                />
                <Divider className="my-2" />
                <Input
                  label="Daily One Point Requirement"
                  placeholder="..."
                  variant="bordered"
                  value={onePointRequirement}
                  onChange={e => setOnePointrequirement(e.target.value)}
                />

                <Input
                  label="Daily Two Point Requirement"
                  placeholder="..."
                  variant="bordered"
                  value={twoPointRequirement}
                  onChange={e => setTwoPointrequirement(e.target.value)}
                />
                <Input
                  label="Daily Three Point Requirement"
                  placeholder="..."
                  variant="bordered"
                  value={threePointRequirement}
                  onChange={e => {setThreePointrequirement(e.target.value)}}
                />
              </ModalBody>
              <ModalFooter>
                <Tooltip
                    delay={0}
                    closeDelay={0}
                    placement="left"
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small">Points refresh daily. </div>
                        <div className="text-small">These should be something you can do every day and should be incremental. </div>
                        <div className="text-tiny">ex. Read 15 mins, Read 30 mins, Read 45 mins</div>
                      </div>
                    }
                  >
                  <Button color="warning" variant="bordered" isIconOnly>
                    <FaInfoCircle />
                  </Button>
                </Tooltip>
                <Button color="warning" onPress={() => {setOnePointrequirement(""); setTwoPointrequirement(""); setThreePointrequirement(""); setLongTermGoal(""); createGoal({updateGoals: setGoals, close: onClose, longTermGoal:longTermGoal, onePointrequirement: onePointRequirement, twoPointRequirement: twoPointRequirement, threePointRequirement: threePointRequirement})}}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


    </main>
  );
}
