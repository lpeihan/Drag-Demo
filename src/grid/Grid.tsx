import React, { Component } from 'react';
import "./Grid.scss";


export default function Grid() {
  return (
    <svg
        className="grid"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <pattern
                id="smallGrid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
            >
                <path 
                    d="M 10 0 L 0 0 0 10" 
                    fill="none" 
                    stroke="rgba(207, 207, 207, 0.3)" 
                    stroke-width="1"
                >
                </path>
            </pattern>
            <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
            >
                <rect width="50" height="50" fill="url(#smallGrid)"></rect>
                <path 
                    d="M 50 0 L 0 0 0 50" 
                    fill="none" 
                    stroke="rgba(186, 186, 186, 0.5)" 
                    stroke-width="1"
                >
                </path>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"></rect>
    </svg>
  )
}