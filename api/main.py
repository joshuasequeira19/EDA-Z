# app.py
from flask import Flask, jsonify, request
import os, requests
from flask_cors import CORS


class Env:
    __CLOUD_API: str

    def __init__(self):
        
        self.__CLOUD_API = os.getenv("CLOUD_API")
    
        if not self.__CLOUD_API:
            print("WARNING: CLOUD_API environment variable is not set!")

    @property
    def cloud_base_url(self):
        return self.__CLOUD_API


env = Env()

app = Flask(__name__)
CORS(app) 

mock_categories = [
    
     {
        "id": "trending",
        "name": "Trending Now",
        "description": "What everyone's watching right now.",
        "imageUrl": "https://st.depositphotos.com/1048238/2171/i/450/depositphotos_21718361-stock-photo-trending-concept.jpg",
    },
    {
        "id": "movies",
        "name": "Movies",
        "description": "Our collection of feature films.",
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1Z4SRgCScmLREokfnKdCOH7iwZm0eYPIIYA6dUqJePP_xnvIl1_BXNok&s",
    },
    {
        "id": "tvshows",
        "name": "TV Shows",
        "description": "The best series to binge watch.",
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9MIQeuda4gHaJrYtAGX8V7ODuE_m1x8PIaQ&s",
    },
    {
        "id": "new",
        "name": "New Releases",
        "description": "Recently added to our library.",
        "imageUrl": "https://media.istockphoto.com/id/467593801/vector/popcorn-falling-in-the-stiped-bag-illustration.jpg?s=612x612&w=is&k=20&c=-w7kmcXSeVk3GR7ltm7gql1E92bSUQOwqETH92L1uVY=",
    },
    {
        "id": "mylist",
        "name": "My List",
        "description": "Your saved content for later.",
        "imageUrl": "https://cdn.shopify.com/s/files/1/0558/6413/1764/files/10_Top_Illustration_Styles_That_is_Popular_in_2024_9_1024x1024.jpg?v=1712248143",
    },
    {
        "id": "action",
        "name": "Action",
        "description": "High-octane thrills and adventure.",
        "imageUrl": "data:image/jpeg;base64,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",
    },
]


mock_movies = [
     {
        "id": "1",
        "name": "Inception",
        "director": "Christopher Nolan",
        "rating": 8.8,
        "categoryId": "movies",
        "category": "Movies",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/fi/thumb/1/17/Inception-poster.jpg/250px-Inception-poster.jpg",
        "duration": 148,
        "released": 2010,
        "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
    },
    {
        "id": "2",
        "name": "The Dark Knight",
        "director": "Christopher Nolan",
        "rating": 9.0,
        "categoryId": "movies",
        "category": "Movies",
        "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "imageUrl": "/images/movies/DarkKnight.jpeg",
        "duration": 152,
        "released": 2008,
        "cast": "Christian Bale, Heath Ledger, Aaron Eckhart",
    },
    {
        "id": "3",
        "name": "Stranger Things",
        "director": "The Duffer Brothers",
        "rating": 8.7,
        "categoryId": "tvshows",
        "category": "TV Shows",
        "description": "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/en/7/78/Stranger_Things_season_4.jpg",
        "duration": 50,
        "released": 2016,
        "cast": "Millie Bobby Brown, Finn Wolfhard, Winona Ryder",
    },
    {
        "id": "4",
        "name": "Breaking Bad",
        "director": "Vince Gilligan",
        "rating": 9.5,
        "categoryId": "tvshows",
        "category": "TV Shows",
        "description": "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        "imageUrl": "https://images.justwatch.com/poster/306097794/s718/breaking-bad.jpg",
        "duration": 49,
        "released": 2008,
        "cast": "Bryan Cranston, Aaron Paul, Anna Gunn",
    },
    {
        "id": "5",
        "name": "Interstellar",
        "director": "Christopher Nolan",
        "rating": 8.6,
        "categoryId": "movies",
        "category": "Movies",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "imageUrl": "/images/movies/Interstellar.jpg",
        "duration": 169,
        "released": 2014,
        "cast": "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    },
    {
        "id": "6",
        "name": "The Queen's Gambit",
        "director": "Scott Frank",
        "rating": 8.6,
        "categoryId": "tvshows",
        "category": "TV Shows",
        "description": "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA. But child stardom comes at a price.",
        "imageUrl": "/images/movies/The_Queens_Gambit.png",
        "duration": 60,
        "released": 2020,
        "cast": "Anya Taylor-Joy, Chloe Pirrie, Bill Camp",
    },
    {
        "id": "7",
        "name": "Dune",
        "director": "Denis Villeneuve",
        "rating": 8.1,
        "categoryId": "new",
        "category": "New Releases",
        "description": "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg",
        "duration": 155,
        "released": 2021,
        "cast": "Timothée Chalamet, Rebecca Ferguson, Zendaya",
    },
    {
        "id": "8",
        "name": "The Witcher",
        "director": "Lauren Schmidt Hissrich",
        "rating": 8.2,
        "categoryId": "tvshows",
        "category": "TV Shows",
        "description": "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        "imageUrl": "/images/movies/Witcher.jpg",
        "duration": 60,
        "released": 2019,
        "cast": "Henry Cavill, Freya Allan, Anya Chalotra",
    },
    {
        "id": "9",
        "name": "The Matrix",
        "director": "The Wachowskis",
        "rating": 8.7,
        "categoryId": "action",
        "category": "Action",
        "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        "imageUrl": "/images/movies/matrix.jpg",
        "duration": 136,
        "released": 1999,
        "cast": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    },
    {
        "id": "10",
        "name": "John Wick",
        "director": "Chad Stahelski",
        "rating": 7.4,
        "categoryId": "action",
        "category": "Action",
        "description": "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.",
        "imageUrl": "/images/movies/john-wick.jpg",
        "duration": 101,
        "released": 2014,
        "cast": "Keanu Reeves, Michael Nyqvist, Alfie Allen",
    },
    {
        "id": "11",
        "name": "Squid Game",
        "director": "Hwang Dong-hyuk",
        "rating": 8.0,
        "categoryId": "trending",
        "category": "Trending Now",
        "description": "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
        "imageUrl": "https://static1.srcdn.com/wordpress/wp-content/uploads/2025/01/characters-from-squid-game-unleashed.jpg",
        "duration": 55,
        "released": 2021,
        "cast": "Lee Jung-jae, Park Hae-soo, Wi Ha-jun",
    },
    {
        "id": "12",
        "name": "No Time to Die",
        "director": "Cary Joji Fukunaga",
        "rating": 7.3,
        "categoryId": "new",
        "category": "New Releases",
        "description": "James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help.",
        "imageUrl": "/images/movies/no_time_to_die.jpg",
        "duration": 163,
        "released": 2021,
        "cast": "Daniel Craig, Ana de Armas, Rami Malek",
    },
    {
        "id": "13",
        "name": "The Mandalorian",
        "director": "Jon Favreau",
        "rating": 8.7,
        "categoryId": "trending",
        "category": "Trending Now",
        "description": "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
        "imageUrl": "https://www.komar.de/media/catalog/product/cache/5/image/9df78eab33525d08d6e5fb8d27136e95/d/x/dx4-086_star_wars_the_mandalorian_the_hunter_web.jpg",
        "duration": 40,
        "released": 2019,
        "cast": "Pedro Pascal, Carl Weathers, Giancarlo Esposito",
    },
    {
        "id": "14",
        "name": "Shang-Chi",
        "director": "Destin Daniel Cretton",
        "rating": 7.4,
        "categoryId": "new",
        "category": "New Releases",
        "description": "Shang-Chi, the master of weaponry-based Kung Fu, is forced to confront his past after being drawn into the Ten Rings organization.",
        "imageUrl": "/images/movies/Shangchi.jpg",
        "duration": 132,
        "released": 2021,
        "cast": "Simu Liu, Awkwafina, Tony Leung Chiu-wai",
    },
]

mock_watchlist = []

def get_movie_by_id(movie_id: str): 
    return next((m for m in mock_movies if str(m["id"]) == str(movie_id)), None)

@app.route("/api/categories", methods=["GET"])
def get_categories():
    return jsonify(mock_categories)

@app.route("/api/categories/<category_id>", methods=["GET"])
def get_category(category_id):
    category = next((c for c in mock_categories if c["id"] == category_id), None)
    if category:
        return jsonify(category)
    return jsonify({"error": "Category not found"}), 404


@app.route("/api/categories/<category_id>/movies", methods=["GET"])
def get_movies_by_category(category_id):
    movies = [m for m in mock_movies if m["categoryId"] == category_id]
    return jsonify(movies)


@app.route("/api/movies/featured", methods=["GET"])
def get_featured_movies():
    featured_ids = ["1", "3", "7", "11", "13"]
    featured = [m for m in mock_movies if m["id"] in featured_ids]
    return jsonify(featured)

@app.route("/api/movies/<movie_id>", methods=["GET"])
def get_movie(movie_id):
    movie = get_movie_by_id(movie_id)
    if movie:
        return jsonify(movie)
    return jsonify({"error": "Movie not found"}), 404


@app.route("/api/movies/recommended", methods=["GET"])
def get_recommendations_from_api():
    """
    Handles GET requests to /api/movies/recommended,
    calls the API Gateway /recommendations endpoint,
    and returns its response containing movie details.
    """
    # Scenario 1: Backend configuration missing
    if not env.cloud_base_url:
         print("ERROR: CLOUD_API environment variable is not set for recommendations.")
         return jsonify({
             "error": "ERR_RECOMMEND_ENDPOINT_CONFIG", 
             "message": "Recommendations service configuration missing in backend."
         }), 500

    cloud_api_endpoint = f"{env.cloud_base_url}/preparesh/recommendations"
    print(
        f"Received request for /api/movies/recommended. Calling API Gateway: {cloud_api_endpoint}"
    )

    try:
        api_response = requests.get(cloud_api_endpoint, timeout=10)
        # Scenario 2: Downstream service returns an HTTP error (e.g., 4xx, 5xx)
        api_response.raise_for_status()
        data_from_api = api_response.json()
        print(f"Successfully received data from API Gateway: {data_from_api}")

        movies = []
        if isinstance(data_from_api, list):
            for item in data_from_api:
                 if isinstance(item, dict) and "movieId" in item:
                     movie = get_movie_by_id(item["movieId"])
                     if movie:
                         movies.append(movie)
                 else:
                    print(f"Skipping invalid item from recommendations API: {item}")

        return jsonify(movies), 200

    # Scenario 3: Network error connecting to downstream service OR downstream timeout
    except requests.exceptions.RequestException as e:
        error_message = f"Error calling Recommendations API Gateway: {e}"
        details = e.response.text if hasattr(e, 'response') and e.response else "No response details"
        status_code = e.response.status_code if hasattr(e, 'response') and e.response else 503 # Service Unavailable

        print(f"{error_message} - Details: {details}")
       
        return (
            jsonify(
                {
                    "error": "ERR_RECOMMEND_ENDPOINT_CONNECTION", 
                    "message": "Could not connect to the recommendations service.",
                    "details": details,
                }
            ),
            status_code, 
        )
    # Scenario 4: Other unexpected errors on the backend
    except Exception as e:
        print(f"An unexpected error occurred processing recommendations: {e}")
        return jsonify({"error": "Internal server error processing recommendations"}), 500

# ---ROUTE FOR LIKES ---
@app.route("/api/movies/like", methods=["POST"])
def like_movie_via_cloud():
    """
    Handles POST requests to /api/movies/like.
    Receives movieId, calls the API Gateway /likes endpoint,
    and relays the success/failure status.
    """
    if not env.cloud_base_url:
         print("ERROR: CLOUD_API environment variable is not set for likes.")
         
         return jsonify({
             "success": False,
             "error": "ERR_LIKE_ENDPOINT_CONFIG" 
             }), 500
    
    data = request.json
    movie_id = data.get("movieId")

    if not movie_id:
        return jsonify({"success": False, "error": "movieId is required"}), 400

    cloud_api_endpoint = f"{env.cloud_base_url}/preparesh/likes"
    print(f"Received like request for movieId: {movie_id}. Calling API Gateway: {cloud_api_endpoint}")
    payload = {"movieId": movie_id}

    try:
        api_response = requests.post(cloud_api_endpoint, json=payload, timeout=10) 
        # Scenario 2: Downstream service returns an HTTP error (e.g., 4xx, 5xx)
        api_response.raise_for_status()

        print(f"Successfully registered like for movieId: {movie_id} via API Gateway. Status: {api_response.status_code}")
        return jsonify({"success": True, "message": "Like registered successfully"}), 200

    # Scenario 3: Network error connecting to downstream service OR downstream timeout
    except requests.exceptions.RequestException as e:
        error_message = f"Error calling Likes API Gateway: {e}"
        details = e.response.text if hasattr(e, 'response') and e.response else "No response details"
        status_code = e.response.status_code if hasattr(e, 'response') and e.response else 503 # Use 503 Service Unavailable

        print(f"{error_message} - Details: {details}")
        
        return (
            jsonify(
                {
                    "success": False,
                    "error": "ERR_LIKE_ENDPOINT_CONNECTION", 
                    "details": details 
                }
            ),
            status_code, 
        )
    # Scenario 4: Other unexpected errors on the backend
    except Exception as e:
        print(f"An unexpected error occurred processing like request: {e}")
        return jsonify({"success": False, "error": "Internal server error processing like"}), 500




@app.route("/api/watchlist", methods=["GET"])
def get_watchlist():
    return jsonify(mock_watchlist)

@app.route("/api/watchlist/add", methods=["POST"])
def add_to_watchlist():
    data = request.json
    movie_id = data.get("movieId")
    movie = get_movie_by_id(movie_id) 
    if not movie:
        return jsonify({"error": "Movie not found"}), 404
    if any(item['id'] == str(movie_id) for item in mock_watchlist): 
        return jsonify({"success": True, "message": "Movie already in your watchlist"})
    else:
        mock_watchlist.append({
            "id": str(movie['id']), 
            "name": movie["name"],
            "imageUrl": movie["imageUrl"],
        })
    return jsonify({"success": True})


@app.route("/api/watchlist/remove/<item_id>", methods=["DELETE"])
def remove_from_watchlist(item_id):
    global mock_watchlist
    initial_length = len(mock_watchlist)
    mock_watchlist = [item for item in mock_watchlist if str(item["id"]) != str(item_id)]
    if len(mock_watchlist) < initial_length:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Item not found in watchlist"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT", 5000), debug=True)