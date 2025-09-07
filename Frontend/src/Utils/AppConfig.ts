class AppConfig {
	public readonly vacationsUrl = "http://localhost:4000/api/vacations/";
	public readonly imageUrl = "http://localhost:4000/api/vacations/images/";
	public readonly likesUrl = "http://localhost:4000/api/likes/";
	public readonly registerUrl = "http://localhost:4000/api/register/";
	public readonly loginUrl = "http://localhost:4000/api/login/";
}

export const appConfig = new AppConfig();
