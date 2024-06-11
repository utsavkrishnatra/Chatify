import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useState } from "react";

const UserHeader = ({ user }) => {
	const [tab,selectTab]=useState('threads');

	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); // logged in user
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

    console.log("updating value is:",updating);

	const handleTabSelect=(e)=>{
		selectTab(e.target.textContent.trim().toLowerCase());
		console.log(tab);
	}

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
						<Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
							threads.net
						</Text>
					</Flex>
				</Box>
				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text>{user.bio}</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
					<Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
					<Link color={"gray.light"}>instagram.com</Link>
				</Flex>
				<Flex>
					<Box className='icon-container'>
						<BsInstagram size={24} cursor={"pointer"} />
					</Box>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex w={"full"}>
				<Flex flex={1} borderBottom={tab === 'threads' ? "1.5px solid white" : "1px solid gray"} justifyContent={"center"} pb='3' cursor={"pointer"}
				color={tab==='threads'?"gray.white":"gray.light"}
				transition="border-bottom-color 0.3s ease-in-out, color 0.3s ease-in-out"
    _hover={{ borderBottomColor: 'gray.white', color: 'gray.white' }}>
					<Text fontWeight={"bold"}  onClick={(e)=>{handleTabSelect(e)}}> Threads</Text>
					
				</Flex>
				<Flex
					flex={1}
					borderBottom={tab==='replies'?"1.5px solid white":"1px solid gray"}
					justifyContent={"center"}
					color={tab==='replies'?"gray.white":"gray.light"}
					pb='3'
					cursor={"pointer"}
					transition="border-bottom-color 0.3s ease-in-out, color 0.3s ease-in-out"
    _hover={{ borderBottomColor: 'gray.white', color: 'gray.white' }}
				>
					<Text fontWeight={"bold"} onClick={(e)=>{handleTabSelect(e)}}> Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;