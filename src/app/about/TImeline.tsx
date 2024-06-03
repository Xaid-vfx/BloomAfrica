'use client'
import { StarIcon, WorkflowIcon } from 'lucide-react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { PiClockCountdownBold } from "react-icons/pi";
export default function Timeline() {
    return (
        <div className='py-10'>
            <VerticalTimeline>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: '#897DD3', color: '#fff' }}
                    visible={true}
                    contentArrowStyle={{ borderRight: '7px solid  #897DD3' }}
                    date="Q2 2024"
                    dateClassName={"text-black"}
                    iconStyle={{ background: '#4A2C84', color: '#fff' }}
                    icon={<HiOutlineRocketLaunch />}
                >
                    <h3 className="vertical-timeline-element-title">Team Up</h3>
                    <h4 className="vertical-timeline-element-subtitle">MVP launch</h4>
                    <p>
                        Update 1.0
                    </p>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="Q3 2024"
                    visible={true}
                    iconStyle={{ background: '#4A2C84', color: '#fff' }}
                    icon={<PiClockCountdownBold />}
                >
                    <h3 className="vertical-timeline-element-title">Coming Soon</h3>
                </VerticalTimelineElement>
            </VerticalTimeline>
        </div>
    )
}