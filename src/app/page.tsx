export default function Home() {
  return (
    <div className="flex flex-col text-black items-center justify-center h-screen bg-gradient-to-br from-white to-gray-600">
      <h1 className="text-4xl font-bold mb-4 animate-fade-in">
        Welcome to Your To-Do App 🎯
      </h1>
      <p className="text-lg opacity-80 max-w-md text-center">
        Organize your tasks, manage your lists, and collaborate with ease.
      </p>
      <a
        href="/signup"
        className="mt-6 bg-white text-black px-6 py-2 rounded-full text-lg font-semibold shadow-md hover:bg-gray-100 transition"
      >
        Get Started
      </a>
    </div>
  );
}
