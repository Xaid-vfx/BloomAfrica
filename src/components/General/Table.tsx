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
import { DialogDemo } from '../Modal/Modal';

interface Column {
    id: 'name' | 'status' | 'date' | 'action' | 'chat';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'name', label: 'CANDIDATES', minWidth: 170 },
    { id: 'status', label: 'STATUS', minWidth: 100 },
    {
        id: 'date',
        label: 'APPLIED DATE',
        minWidth: 170,
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'action',
        label: 'ACTION',
        minWidth: 170,
        align: 'center',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'chat',
        label: 'Chat applicant',
        minWidth: 170,
        align: 'center',
        format: (value: number) => value.toLocaleString('en-US'),
    },
];

interface Data {
    id: number,
    name: string;
    status: string;
    date: string;
    action: string;
    uid: string
}

function createData(
    id: number,
    name: string,
    status: string,
    date: string,
    action: string,
    uid: string
): Data {

    return { id, name, status, date, action, uid };
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

export default function StickyHeadTable(props: any) {
    console.log(props.applications);

    const rows = [...props.applications.map((app: any) => {
        return createData(app.id, app.name, "Active", app.created_at.substring(0, app.created_at.indexOf('T')), "View", app.seeker_id);
    })];

    rows.sort((a, b) => b.id - a.id);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(2);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                                        fontSize: '15px'
                                    }}
                                >
                                    {column.id == "name" ? <div className='pl-6'>{column.label}</div> : column.label}
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
                                                    {column.id === 'name' ? (
                                                        <div className='flex items-center gap-3 pr-10 pl-6'>
                                                            <Image src={User} alt='' width={40} className='border rounded-full p-1' />
                                                            <div>
                                                                <h2 className='font-[500] font-sans text-lg'>{value}</h2>
                                                                <p className='text-sm text-[#4A2C84]'>Product Designer</p>
                                                                <p className='text-sm text-[#7C8493]'>Yaba, Lagos</p>
                                                            </div>
                                                        </div>
                                                    ) : ""}

                                                    {column.id === 'date' ? <div className='text-base text-[#7C8493]'>{value}</div> : ""}

                                                    {column.id === 'status' ? <div className='text-base'>{value}</div> : ""}

                                                    {column.id === 'action' ? <div className='flex justify-center'>
                                                        <div onClick={() => {
                                                            console.log(row);
                                                            props.fetchApplicantDetails(row.uid)
                                                        }} className='bg-[#E9EBFD] text-[#4A2C84] px-4 py-2 font-semibold rounded-3xl'>
                                                            View Application</div>
                                                    </div> : ""}
                                                    {column.id === 'chat' ? <div className='flex justify-center'>
                                                        <DialogDemo seeker_id={row.uid} name={row.name} user_id={props.user.id} />
                                                    </div> : ""
                                                    }

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