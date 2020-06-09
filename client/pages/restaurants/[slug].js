import React from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
// import components
import { Grid, Typography } from "@material-ui/core";
import ListingCard from "../../components/ListingCard";
// import store
import useStore from "../../store/useStore";
import { addItem } from "../../store/actions/cart";

// ******************
// component
// ******************

const restaurants = ({ restaurant, dishes }) => {
	const { state, dispatch } = useStore();
	const router = useRouter();

	const displayDishes = dishes?.map((dish) => (
		<Grid item key={dish.id}>
			<ListingCard
				image={`http://localhost:1337${dish.image.url}`}
				name={dish.name}
				description={dish.description}
				buttonText="Add to Cart"
				buttonClick={() => {
					const payload = { dish, restaurant };
					addItem(payload, state, dispatch);
				}}
			/>
		</Grid>
	));

	// If the page is not yet generated, this will be displayed
	// initially until getStaticProps() finishes running
	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<StyledGrid>
				<RestaurantName>
					<Typography variant="h2" component="h1">
						{restaurant.name}
					</Typography>
				</RestaurantName>
				{displayDishes}
			</StyledGrid>
		</>
	);
};
export default restaurants;

// ******************
// styles
// ******************

import { StyledGrid } from "../../styles/elements";

const RestaurantName = styled.div`
	place-self: center;
`;

// ******************
// initial props & paths
// ******************
// TODO: consider implementing when ready for build
// TODO: also consider moving restaurant fetching to its own page

// This function gets called at build time
export const getStaticPaths = async () => {
	// Call an external API endpoint to get posts
	try {
		const response = await axios.get("http://localhost:1337/restaurants");
		const restaurants = response.data;

		// Get the paths we want to pre-render based on posts
		const paths = restaurants.map((restaurant) => ({
			params: { slug: restaurant.slug },
		}));

		// We'll pre-render only these paths at build time.
		// { fallback: false } means other routes should 404.
		return { paths, fallback: false };
	} catch (error) {
		console.error(error);
	}
};

export const getStaticProps = async ({ params }) => {
	try {
		const response = await axios.get(
			`http://localhost:1337/restaurants/${params.slug}`,
		);
		const restaurant = response.data;
		const dishes = response.data.dishes;
		return {
			props: {
				restaurant,
				dishes,
			},
		};
	} catch (error) {
		console.error(error);
	}
};
