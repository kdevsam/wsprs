import Tile from "./Tile";

const TileGrid = ({
  tiles,
  onTileClick,
  lost,
  blowaway,
  pulse,
  won,
}: {
  tiles: any[];
  onTileClick: (id: number) => void;
  lost: boolean;
  blowaway: boolean;
  pulse: boolean;
  won: boolean;
}) => {
  return (
    <div
      className={`grid grid-cols-4 gap-3 sm:gap-5 p-4 sm:p-6 relative transition-all duration-500 ${
        lost && !blowaway ? "opacity-100" : "opacity-100"
      }`}
    >
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          onClick={() => onTileClick(tile.id)}
          lost={lost}
          blowaway={tile.blowaway}
          pulse={pulse}
          won={won}
        />
      ))}
    </div>
  );
};

export default TileGrid;
