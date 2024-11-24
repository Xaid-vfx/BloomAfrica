import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Image from 'next/image';
import User from '../../assets/images/user.jpg'
import { HiOutlineLocationMarker } from "react-icons/hi";
import PaymentComponent from '../Payment/Payment';

interface Column {
    id: 'title' | 'location' | 'date' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'title', label: 'TITLE', minWidth: 170 },
    { id: 'location', label: 'LOCATION', minWidth: 100 },
    {
        id: 'date',
        label: 'APPLIED ON',
        minWidth: 170,
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'action',
        label: 'ACTION',
        minWidth: 100,
        align: 'center',
        format: (value: number) => value.toLocaleString('en-US'),
    },
];

interface Data {
    id: number,
    title: string;
    location: string;
    date: string;
    action: string;
    signup_fee: number;
}

function createData(
    id: number,
    title: string,
    location: string,
    date: string,
    action: string,
    signup_fee: number
): Data {

    return { id, title, location, date, action, signup_fee };
}

// const rows = [
//     createData('India', 'IN', 1324171354, 3287263),
//     createData('China', 'CN', 1403500365, 9596961),
//     createData('Italy', 'IT', 60483973, 301340),
//     createData('United States', 'US', 327167434, 9833520),
//     createData('Canada', 'CA', 37602103, 9984670),
//     createData('Australia', 'AU', 25475400, 7692024),
//     createData('Germany', 'DE', 83019200, 357578),
//     createData('Ireland', 'IE', 4857000, 70273),
//     createData('Mexico', 'MX', 126577691, 1972550),
//     createData('Japan', 'JP', 126317000, 377973),
//     createData('France', 'FR', 67022000, 640679),
//     createData('United Kingdom', 'GB', 67545757, 242495),
//     createData('Russia', 'RU', 146793744, 17098246),
//     createData('Nigeria', 'NG', 200962417, 923768),
//     createData('Brazil', 'BR', 210147125, 8515767),
// ];

export default function AppliedTable(props: any) {
    console.log(props.jobs);

    const rows = [...props.jobs.map((job: any) => {
        return createData(job.id, job.title, job.location, job.created_at.substring(0, job.created_at.indexOf('T')), "...", job.signup_fee);
    })];

    rows.sort((a, b) => b.id - a.id);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(3);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderBottomLeftRadius: "12px", borderBottomRightRadiusRadius: "12px", boxShadow: "none" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        color: '#7C8493',
                                        fontWeight: '400',
                                        fontSize: '15px',
                                        borderTop: '1px solid #e5e7eb'
                                    }}
                                >
                                    {column.id == "title" ? <div className='pl-6'>{column.label}</div> : column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'title' ? (
                                                        <div className='flex-col gap-3 pr-10 pl-6'>


                                                            <h2 className='font-[500] font-sans text-lg'>{value}</h2>
                                                            <p className='flex gap-1 items-baseline text-sm text-[#4A2C84]'><HiOutlineLocationMarker /> Yaba, Lagos</p>

                                                        </div>
                                                    ) : ""}

                                                    {column.id === 'location' ? <div className='text-base  text-[#7C8493]'>{value}</div> : ""}

                                                    {column.id === 'date' ? <div className='text-base text-[#7C8493]'>{value}</div> : ""}

                                                    {column.id === 'action' ? <div className='flex flex-col gap-2 justify-center py-1'>
                                                        <button onClick={() => {
                                                            console.log(row);
                                                        }} className='text-center bg-[#E9EBFD] text-[#4A2C84] px-4 py-2 font-semibold rounded-3xl'>
                                                            View Application</button>
                                                        {
                                                            row.signup_fee > 0 ? <PaymentComponent /> : ""
                                                        }
                                                        {/* <button onClick={() => {
                                                            props.startPayment(props.jobs[props.jobs.map(
                                                                (job: any) => {
                                                                    return job.id;
                                                                }).indexOf(row.id)])
                                                        }
                                                        } className='text-center bg-[#E9EBFD] text-[#4A2C84] px-4 py-2 font-semibold rounded-3xl'>
                                                            Pay</button> */}
                                                        {/* <button onClick={() => { props.delete(row.id) }} className='bg-white border border-[#c94040] text-[#c94040] px-4 py-2 font-semibold rounded-3xl'>
                                                            Delete</button> */}
                                                    </div> : ""}

                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                // rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}