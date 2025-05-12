import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { HiOutlineLocationMarker } from "react-icons/hi";

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
        label: 'CREATED ON',
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
    uid: string
}

function createData(
    id: number,
    title: string,
    location: string,
    date: string,
    action: string,
    uid: string
): Data {

    return { id, title, location, date, action, uid };
}

export default function SavedTable(props: any) {
    console.log(props.jobs);

    const rows = [...props.jobs.map((job: any) => {
        return createData(job.id, job.title, job.location, job.created_at.substring(0, job.created_at.indexOf('T')), "...", job.uid);
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
                                    {column.id === "title" ? <div className='pl-6'>{column.label}</div> : column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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
                                                        <a href={`/all-trainings/job?id=${row.uid}`} className='text-center bg-[#E9EBFD] text-[#4A2C84] px-4 py-2 font-semibold rounded-xl'>
                                                            View Job</a>
                                                        <button onClick={() => { props.delete(row.id) }} className='bg-white border border-[#c94040] text-[#c94040] px-4 py-2 font-semibold rounded-xl'>
                                                            Delete</button>
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