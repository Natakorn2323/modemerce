import ModCard from './ModCard'
import styles from './ModGrid.module.css'

const MODS = [
  { id:1,  title:'NaturalVision Evolved',    game:'GTA V',          emoji:'🌆', price:'Free', rating:4.9, downloads:'2.4M', category:'Graphics',    seller:'Razed_FX' },
  { id:2,  title:'Requiem 5.1 Overhaul',     game:'Skyrim SE',      emoji:'⚔️', price:'฿59',  rating:4.8, downloads:'1.8M', category:'Gameplay',    seller:'Ogerboss' },
  { id:3,  title:'Engine Tweaks',            game:'Cyberpunk 2077', emoji:'🤖', price:'Free', rating:4.7, downloads:'980K', category:'Performance', seller:'maximegmd' },
  { id:4,  title:'Seamless Co-op',           game:'Elden Ring',     emoji:'🗡️', price:'Free', rating:4.9, downloads:'1.2M', category:'Multiplayer', seller:'LukeYui' },
  { id:5,  title:'OptiFine Ultra 1.21',      game:'Minecraft',      emoji:'⛏️', price:'Free', rating:4.8, downloads:'3.1M', category:'Performance', seller:'sp614x' },
  { id:6,  title:"Brita's Weapon Pack",      game:'Project Zomboid',emoji:'🧟', price:'฿29',  rating:4.6, downloads:'650K', category:'Content',     seller:'Brita' },
  { id:7,  title:'STALKER Anomaly',          game:'S.T.A.L.K.E.R.',emoji:'☢️', price:'Free', rating:4.9, downloads:'420K', category:'Total Conv',  seller:'Anomaly Team' },
  { id:8,  title:'Vortex Framework',         game:'Fallout 4',      emoji:'⚛️', price:'Free', rating:4.5, downloads:'760K', category:'Utility',     seller:'Nexus Mods' },
  { id:9,  title:'Redux Remaster',           game:'The Witcher 3',  emoji:'🧙', price:'฿49',  rating:4.7, downloads:'550K', category:'Graphics',    seller:'Marcin' },
  { id:10, title:'Brutal Doom 64',           game:'DOOM',           emoji:'👹', price:'Free', rating:4.8, downloads:'890K', category:'Gameplay',    seller:'Sergeant_Mark_IV' },
  { id:11, title:'RimWorld CE',              game:'RimWorld',       emoji:'🚀', price:'Free', rating:4.6, downloads:'440K', category:'Combat',      seller:'CE Team' },
  { id:12, title:'Stardew Valley Plus',      game:'Stardew Valley', emoji:'🌾', price:'฿19',  rating:4.7, downloads:'320K', category:'Content',     seller:'Pathoschild' },
  { id:13, title:'Better Water',             game:'Valheim',        emoji:'🌊', price:'Free', rating:4.4, downloads:'280K', category:'Graphics',    seller:'Aedenthorn' },
  { id:14, title:'Lives Rebalanced',         game:'Dark Souls 3',   emoji:'🔥', price:'Free', rating:4.5, downloads:'190K', category:'Gameplay',    seller:'iShadowWolf' },
  { id:15, title:'Ultra Texture Pack',       game:'Resident Evil 4',emoji:'🎯', price:'฿39',  rating:4.8, downloads:'510K', category:'Graphics',    seller:'Crazy Potato' },
  { id:16, title:'Open World Expander',      game:'Satisfactory',   emoji:'🏭', price:'Free', rating:4.6, downloads:'230K', category:'Map',         seller:'Mircea' },
  { id:17, title:'True Survival Redux',      game:'7 Days to Die',  emoji:'🧱', price:'฿25',  rating:4.5, downloads:'380K', category:'Survival',    seller:'StompyNZ' },
  { id:18, title:'HD Face Textures',         game:'The Sims 4',     emoji:'💄', price:'Free', rating:4.3, downloads:'820K', category:'Cosmetic',    seller:'Simomi' },
  { id:19, title:'Combat Overhaul Pro',      game:'Mount & Blade 2',emoji:'🏹', price:'฿45',  rating:4.7, downloads:'290K', category:'Combat',      seller:'Bloc' },
  { id:20, title:'Immersive Citizens AI',    game:'Skyrim SE',      emoji:'🏘️', price:'Free', rating:4.6, downloads:'1.1M', category:'NPC',         seller:'Arnaud.dorchymont' },
]

export default function ModGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="section-title">🎮 Mods ล่าสุด</h2>
        <div className={styles.filters}>
          {['ทั้งหมด', 'Graphics', 'Gameplay', 'Performance', 'Content', 'Free'].map(f => (
            <button key={f} className={`${styles.filter} ${f === 'ทั้งหมด' ? styles.filterActive : ''}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {MODS.map(mod => (
          <ModCard key={mod.id} {...mod} />
        ))}
      </div>

      <div className={styles.more}>
        <button className={styles.moreBtn}>
          ดู Mods เพิ่มเติม
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </section>
  )
}
