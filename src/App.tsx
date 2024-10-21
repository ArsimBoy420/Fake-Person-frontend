import React, { useState } from "react";
import {
    Box,
    Button,
    Text,
    UnorderedList,
    ListItem,
    Alert,
    AlertIcon,
    Flex,
} from "@chakra-ui/react";
import axios from 'axios';

type FullPersonDTO = {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    address?: AddressOutput;
    phoneNumber?: string;
    cpr?: string; // Added CPR here
};

type AddressOutput = {
    street: string;
    houseNumber: number;
    floor?: string;
    door?: string;
    postalCode: number;
    town: string;
};

type CprOutput = {
    firstName: string;
    lastName: string;
    cpr: string;
    gender?: string;
    dateOfBirth?: string;
};

type OutputData = CprOutput | FullPersonDTO | AddressOutput | null;

const App: React.FC = () => {
    const [persons, setPersons] = useState<FullPersonDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [output, setOutput] = useState<OutputData>(null);

    const fetchBulkPersons = async () => {
        try {
            const response = await axios.get("/api/persons/bulk?count=10");
            if (response.status !== 200) {
                throw new Error("Failed to fetch persons");
            }
            const data: FullPersonDTO[] = response.data;
            setPersons(data);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const fetchData = async (endpoint: string) => {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(data); // Log for debugging
            setOutput(data);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                setOutput(null);
            } else {
                setError("An unknown error occurred");
                setOutput(null);
            }
        }
    };

    return (
        <Flex direction="row" alignItems="flex-start" justifyContent="space-around" p={4}>
            <Box>
                <Text fontSize="3xl" fontWeight="bold" mb={4}>
                    Fetch Persons
                </Text>
                <Button colorScheme="teal" size="lg" onClick={fetchBulkPersons} mb={4}>
                    Get Persons
                </Button>

                {error && (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                {persons.length > 0 ? (
                    <Box bg="lightgray" p={4} borderRadius="md" width="100%" maxW="350px">
                        <UnorderedList spacing={3} listStyleType="none" textAlign="left">
                            {persons.map((person) => (
                                <ListItem key={person.id} bg="white" p={4} boxShadow="md" borderRadius="md">
                                    <Text fontWeight="bold">
                                        {person.firstName} {person.lastName}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        Date of Birth: {person.dateOfBirth}
                                    </Text>
                                    {person.phoneNumber && (
                                        <Text fontSize="sm" color="gray.600">
                                            Phone Number: {person.phoneNumber}
                                        </Text>
                                    )}
                                </ListItem>
                            ))}
                        </UnorderedList>
                    </Box>
                ) : (
                    <Text mt={4}>No persons fetched yet.</Text>
                )}
            </Box>

            <Box>
                <Text fontSize="3xl" fontWeight="bold" mb={4}>
                    Fetch Data from Endpoints
                </Text>

                <Button colorScheme="blue" size="md" onClick={() => fetchData("/api/persons/fname-lname-cpr")} mb={4}>
                    Fetch Fname-Lname-CPR
                </Button>
                <Button colorScheme="green" size="md" onClick={() => fetchData("/api/persons/fname-lname-cpr-dob")} mb={4}>
                    Fetch Fname-Lname-CPR-DOB
                </Button>
                <Button colorScheme="purple" size="md" onClick={() => fetchData("/api/persons/cpr-fname-lname-gender")} mb={4}>
                    Fetch CPR-Fname-Lname-Gender
                </Button>
                <Button colorScheme="yellow" size="md" onClick={() => fetchData("/api/persons/cpr-fname-lname-gender-dob")} mb={4}>
                    Fetch CPR-Fname-Lname-Gender-DOB
                </Button>
                <Button colorScheme="red" size="md" onClick={() => fetchData("/api/persons/address")} mb={4}>
                    Fetch Address
                </Button>
                <Button colorScheme="orange" size="md" onClick={() => fetchData("/api/persons/phone")} mb={4}>
                    Fetch Phone
                </Button>
                <Button colorScheme="cyan" size="md" onClick={() => fetchData("/api/persons/single")} mb={4}>
                    Fetch Single Person
                </Button>
                <Button colorScheme="teal" size="md" onClick={() => fetchData("/api/persons/cpr")} mb={4}>
                    Fetch CPR
                </Button>

                {/* Output section */}
                {output && (
                    <Box
                        bg="white"
                        p={4}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="gray.300"
                        width="100%"
                        maxW="350px"
                        boxShadow="md"
                        mt={4}
                    >
                        {Array.isArray(output) ? (
                            <UnorderedList spacing={3} listStyleType="none" textAlign="left">
                                {output.map((person) => (
                                    <ListItem key={person.id} bg="lightgray" p={2} borderRadius="md">
                                        <Text fontWeight="bold">
                                            {person.firstName} {person.lastName}
                                        </Text>
                                        <Text>Date of Birth: {person.dateOfBirth}</Text>
                                        {person.phoneNumber && <Text>Phone: {person.phoneNumber}</Text>}
                                    </ListItem>
                                ))}
                            </UnorderedList>
                        ) : output && 'street' in output ? (
                            <Box>
                                <Text fontWeight="bold">Address:</Text>
                                <Text>{output.street}, {output.houseNumber}, {output.town}</Text>
                                {output.floor && <Text>Floor: {output.floor}</Text>}
                                {output.door && <Text>Door: {output.door}</Text>}
                                <Text>Postal Code: {output.postalCode}</Text>
                            </Box>
                        ) : (
                            <Box>
                                <Text fontWeight="bold">{(output as FullPersonDTO).firstName} {(output as FullPersonDTO).lastName}</Text>
                                {/* Show CPR */}
                                {(output as FullPersonDTO).cpr && (
                                    <Text>CPR: {(output as FullPersonDTO).cpr}</Text>
                                )}
                                {(output as FullPersonDTO).gender && <Text>Gender: {(output as FullPersonDTO).gender}</Text>}
                                {(output as FullPersonDTO).dateOfBirth && <Text>Date of Birth: {(output as FullPersonDTO).dateOfBirth}</Text>}
                                {(output as FullPersonDTO).phoneNumber && <Text>Phone: {(output as FullPersonDTO).phoneNumber}</Text>}
                                {(output as FullPersonDTO).address && (
                                    <Box mt={2}>
                                        <Text fontWeight="bold">Address:</Text>
                                        <Text>{(output as FullPersonDTO).address.street}, {(output as FullPersonDTO).address.houseNumber}, {(output as FullPersonDTO).address.town}</Text>
                                        {output.address.floor && <Text>Floor: {output.address.floor}</Text>}
                                        {output.address.door && <Text>Door: {output.address.door}</Text>}
                                        <Text>Postal Code: {output.address.postalCode}</Text>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                )}

                {error && (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
            </Box>
        </Flex>
    );
};

export default App;
