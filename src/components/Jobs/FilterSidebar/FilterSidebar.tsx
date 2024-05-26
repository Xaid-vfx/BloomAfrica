'use client'

import { useState } from "react"

export default function FilterSidebar(props: any) {

    return (
        <div className="px-10">
            <div className="flex flex-col gap-3">
                <p className="font-semibold">Types of Employement</p>
                <div className="text-[#515B6F] flex flex-col gap-4">
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedTypes?.includes('Full Time')} value="Full Time" onChange={(e) => {
                            props.handleTypeChange("Full Time")
                        }} /><p className="ml-3">Full Time</p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedTypes?.includes('Part Time')} value="Part Time" onChange={(e) => {
                            props.handleTypeChange("Part Time")
                        }} /><p className="ml-3">Part Time</p>
                    </div>
                </div>

                <p className="font-semibold mt-8">Categories</p>
                <div className="text-[#515B6F] flex flex-col gap-4">
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Technology')} value="Technology" onChange={(e) => {
                            props.handleCategoryChange("Technology")
                        }} /><p className="ml-3">Technology </p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Electrical Engineering')} value={'Electrical Engineering'} onChange={() => props.handleCategoryChange('Electrical Engineering')}
                        /><p className="ml-3">Electrical Engineering </p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Mechanical Engineering')} value="Mechanical Engineering" onChange={(e) => {
                            props.handleCategoryChange("Mechanical Engineering")
                        }} /><p className="ml-3">Mechanical Engineering </p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Construction & Civil Engineering')} value="Construction & Civil Engineering" onChange={(e) => {
                            props.handleCategoryChange("Construction & Civil Engineering")
                        }} /><p className="ml-3">Construction & Civil Engineering </p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Business Entreprenuership')} value="Business Entreprenuership" onChange={(e) => {
                            props.handleCategoryChange("Business Entreprenuership")
                        }} /><p className="ml-3">Business Entreprenuership</p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Cosmetology')} value="Cosmetology" onChange={(e) => {
                            props.handleCategoryChange("Cosmetology")
                        }} /><p className="ml-3">Cosmetology </p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Hospitality')} value="Hospitality" onChange={(e) => {
                            props.handleCategoryChange("Hospitality")
                        }} /><p className="ml-3">Hospitality </p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Fashion')} value="Fashion" onChange={(e) => {
                            props.handleCategoryChange("Fashion")
                        }} /><p className="ml-3">Fashion </p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedCategories?.includes('Food & Cullinary')} value="Food & Cullinary" onChange={(e) => {
                            props.handleCategoryChange("Food & Cullinary")
                        }} /><p className="ml-3">Food & Cullinary </p>
                    </div>
                </div>
            </div>
        </div >
    )
}