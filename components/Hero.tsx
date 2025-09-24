export default function Hero() {
  return (
    <div className="relative h-[45vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/55 dark:from-white/15 dark:to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Al Marsam Learning Platform
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover a world of learning with our expertly crafted courses.
            Learn from industry professionals and take your skills to the next
            level with Al Marsam.
          </p>
        </div>
      </div>
    </div>
  );
}
