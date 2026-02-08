@echo off
echo WARNING: This will delete all data!
set /p confirm="Are you sure? (y/n): "
if /i "%confirm%"=="y" (
    echo Stopping and removing containers and volumes...
    docker-compose down -v
    echo Cleanup complete!
) else (
    echo Cleanup cancelled.
)