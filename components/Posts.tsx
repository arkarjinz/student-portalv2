'use client';
import React, { useEffect, useState, useRef } from "react";
import { getLoggedInUser, isUserLoggedIn } from "@/service/AuthService";
import { redirect } from "next/navigation";
import { Post } from "@/ds/post.dto";
import { getAllPosts } from "@/service/StudentPortalService";
import { createPost, deletePost, updatePost } from "@/service/PostService";
import Image from "next/image";
import { GiRose } from "react-icons/gi";

// Helper function to escape special characters in a regex
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newPost, setNewPost] = useState("");
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // State for rude word detection & blocking (for posting)
    const [rudeAttempts, setRudeAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimer, setBlockTimer] = useState(60);
    const [rudeNotice, setRudeNotice] = useState("");

    // New state to control warning video visibility
    const [showWarningVideo, setShowWarningVideo] = useState(false);

    // For live relative time display of createdAt
    const [now, setNow] = useState(new Date());
    const loggedInUser = getLoggedInUser();

    // State for inline editing/updating a post
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");

    // State for update-specific inappropriate attempt counter
    const [updateAttempts, setUpdateAttempts] = useState(0);

    // State for confirmation modal (update/delete)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmModalType, setConfirmModalType] = useState(""); // "delete" or "update"
    const [confirmModalPostId, setConfirmModalPostId] = useState<number | null>(null);

    // List of prohibited words
    const rudeWords = `
abbo
abo
abortion
abuse
addict
addicts
adult
africa
african
alla
allah
alligatorbait
amateur
american
anal
analannie
analsex
angie
angry
anus
arab
arabs
areola
argie
aroused
arse
arsehole
asian
ass
assassin
assassinate
assassination
assault
assbagger
assblaster
assclown
asscowboy
asses
assfuck
assfucker
asshat
asshole
assholes
ashore
assjockey
asskiss
asskisser
assklown
asslick
asslicker
asslover
assman
assmonkey
assmunch
assmuncher
asspacker
asspirate
asspuppies
assranger
asswhore
asswipe
athletesfoot
attack
australian
babe
babies
backdoor
backdoorman
backseat
badfuck
balllicker
balls
ballsack
banging
baptist
barelylegal
barf
barface
barfface
bast
bastard
bazongas
bazooms
beaner
beast
beastality
beastial
beastiality
beatoff
beat-off
beatyourmeat
beaver
bestial
bestiality
bi
biatch
bible
bicurious
bigass
bigbastard
bigbutt
bigger
bisexual
bi-sexual
bitch
bitcher
bitches
bitchez
bitchin
bitching
bitchslap
bitchy
biteme
black
blackman
blackout
blacks
blind
blow
blowjob
boang
bogan
bohunk
bollick
bollock
bomb
bombers
bombing
bombs
bomd
bondage
boner
bong
boob
boobies
boobs
booby
boody
boom
boong
boonga
boonie
booty
bootycall
bountybar
bra
brea5t
breast
breastjob
breastlover
breastman
brothel
bugger
buggered
buggery
bullcrap
bulldike
bulldyke
bullshit
bumblefuck
bumfuck
bunga
bunghole
buried
burn
butchbabes
butchdike
butchdyke
butt
buttbang
butt-bang
buttface
buttfuck
butt-fuck
buttfucker
butt-fucker
buttfuckers
butt-fuckers
butthead
buttman
buttmunch
buttmuncher
buttpirate
buttplug
buttstain
byatch
cacker
cameljockey
cameltoe
canadian
cancer
carpetmuncher
carruth
catholic
catholics
cemetery
chav
cherrypopper
chickslick
children's
chin
chinaman
chinamen
chinese
chink
chinky
choad
chode
christ
christian
church
cigarette
cigs
clamdigger
clamdiver
clit
clitoris
clogwog
cocaine
cock
cockblock
cockblocker
cockcowboy
cockfight
cockhead
cockknob
cocklicker
cocklover
cocknob
cockqueen
cockrider
cocksman
cocksmith
cocksmoker
cocksucer
cocksuck
cocksucked
cocksucker
cocksucking
cocktail
cocktease
cocky
cohee
coitus
color
colored
coloured
commie
communist
condom
conservative
conspiracy
coolie
cooly
coon
coondog
copulate
cornhole
corruption
cra5h
crabs
crack
crackpipe
crackwhore
crack-whore
crap
crapola
crapper
crappy
crash
creamy
crime
crimes
criminal
criminals
crotch
crotchjockey
crotchmonkey
crotchrot
cum
cumbubble
cumfest
cumjockey
cumm
cummer
cumming
cumquat
cumqueen
cumshot
cunilingus
cunillingus
cunn
cunnilingus
cunntt
cunt
cunteyed
cuntfuck
cuntfucker
cuntlick
cuntlicker
cuntlicking
cuntsucker
cybersex
cyberslimer
dago
dahmer
dammit
damn
damnation
damnit
darkie
darky
datnigga
dead
deapthroat
death
deepthroat
defecate
dego
demon
deposit
desire
destroy
deth
devil
devilworshipper
dick
dickbrain
dickforbrains
dickhead
dickless
dicklick
dicklicker
dickman
dickwad
dickweed
diddle
die
died
dies
dike
dildo
dingleberry
dink
dipshit
dipstick
dirty
disease
diseases
disturbed
dive
dix
dixiedike
dixiedyke
doggiestyle
doggystyle
dong
doodoo
doo-doo
doom
dope
dragqueen
dragqween
dripdick
drug
drunk
drunken
dumb
dumbass
dumbbitch
dumbfuck
dyefly
dyke
easyslut
eatballs
eatme
eatpussy
ecstacy
ejaculate
ejaculated
ejaculating
ejaculation
enema
enemy
erect
erection
ero
escort
ethiopian
ethnic
european
evl
excrement
execute
executed
execution
executioner
explosion
facefucker
faeces
fag
fagging
faggot
fagot
failed
failure
fairies
fairy
faith
fannyfucker
fart
farted
farting
farty
fastfuck
fat
fatah
fatass
fatfuck
fatfucker
fatso
fckcum
fear
feces
felatio
felch
felcher
felching
fellatio
feltch
feltcher
feltching
fetish
fight
filipina
filipino
fingerfood
fingerfuck
fingerfucked
fingerfucker
fingerfuckers
fingerfucking
fire
firing
fister
fistfuck
fistfucked
fistfucker
fistfucking
fisting
flange
flasher
flatulence
floo
flydie
flydye
fok
fondle
footaction
footfuck
footfucker
footlicker
footstar
fore
foreskin
forni
fornicate
foursome
fourtwenty
fraud
freakfuck
freakyfucker
freefuck
fu
fubar
fuc
fucck
fuck
fucka
fuckable
fuckbag
fuckbuddy
fucked
fuckedup
fucker
fuckers
fuckface
fuckfest
fuckfreak
fuckfriend
fuckhead
fuckher
fuckin
fuckina
fucking
fuckingbitch
fuckinnuts
fuckinright
fuckit
fuckknob
fuckme
fuckmehard
fuckmonkey
fuckoff
fuckpig
fucks
fucktard
fuckwhore
fuckyou
fudgepacker
fugly
fuk
fuks
funeral
funfuck
fungus
fuuck
gangbang
gangbanged
gangbanger
gangsta
gatorbait
gay
gaymuthafuckinwhore
gaysex
geez
geezer
geni
genital
german
getiton
gin
ginzo
gipp
girls
givehead
glazeddonut
gob
god
godammit
goddamit
goddammit
goddamn
goddamned
goddamnes
goddamnit
goddamnmuthafucker
goldenshower
gonorrehea
gonzagas
gook
gotohell
goy
goyim
greaseball
gringo
groe
gross
grostulation
gubba
gummer
gun
gyp
gypo
gypp
gyppie
gyppo
gyppy
hamas
handjob
hapa
harder
hardon
harem
headfuck
headlights
hebe
heeb
hell
henhouse
heroin
herpes
heterosexual
hijack
hijacker
hijacking
hillbillies
hindoo
hiscock
hitler
hitlerism
hitlerist
hiv
ho
hobo
hodgie
hoes
hole
holestuffer
homicide
homo
homobangers
homosexual
honger
honk
honkers
honkey
honky
hook
hooker
hookers
hooters
hore
hork
horn
horney
horniest
horny
horseshit
hosejob
hoser
hostage
hotdamn
hotpussy
hottotrot
hummer
husky
hussy
hustler
hymen
hymie
iblowu
idiot
ikey
illegal
incest
insest
intercourse
interracial
intheass
inthebuff
israel
israeli
israel's
italiano
itch
jackass
jackoff
jackshit
jacktheripper
jade
jap
japanese
japcrap
jebus
jeez
jerkoff
jesus
jesuschrist
jew
jewish
jiga
jigaboo
jigg
jigga
jiggabo
jigger
jiggy
jihad
jijjiboo
jimfish
jism
jiz
jizim
jizjuice
jizm
jizz
jizzim
jizzum
joint
juggalo
jugs
junglebunny
kaffer
kaffir
kaffre
kafir
kanake
kid
kigger
kike
kill
killed
killer
killing
kills
kink
kinky
kissass
kkk
knife
knockers
kock
kondum
koon
kotex
krap
krappy
kraut
kum
kumbubble
kumbullbe
kummer
kumming
kumquat
kums
kunilingus
kunnilingus
kunt
ky
kyke
lactate
laid
lapdance
latin
lee
lesbain
lesbayn
lesbian
lesbin
lesbo
lez
lezbe
lezbefriends
lezbo
lezz
lezzo
liberal
libido
licker
lickme
lies
limey
limpdick
limy
lingerie
liquor
livesex
loadedgun
lolita
looser
loser
lotion
lovebone
lovegoo
lovegun
lovejuice
lovemuscle
lovepistol
loverocket
lowlife
lsd
lubejob
lucifer
luckycammeltoe
lugan
lynch
macaca
mad
mafia
magicwand
mams
manhater
manpaste
marijuana
mastabate
mastabater
masterbate
masterblaster
mastrabator
masturbate
masturbating
mattressprincess
meatbeatter
meatrack
meth
mexican
mgger
mggor
mickeyfinn
mideast
milf
minority
mockey
mockie
mocky
mofo
moky
moles
molest
molestation
molester
molestor
moneyshot
mooncricket
mormon
moron
moslem
mosshead
mothafuck
mothafucka
mothafuckaz
mothafucked
mothafucker
mothafuckin
mothafucking
mothafuckings
motherfuck
motherfucked
motherfucker
motherfuckin
motherfucking
motherfuckings
motherlovebone
muff
muffdive
muffdiver
muffindiver
mufflikcer
mulatto
muncher
munt
murder
murderer
muslim
naked
narcotic
nasty
nastybitch
nastyho
nastyslut
nastywhore
nazi
necro
negro
negroes
negroid
negro's
nig
niger
nigerian
nigerians
nigg
nigga
niggah
niggaracci
niggard
niggarded
niggarding
niggardliness
niggardliness's
niggardly
niggards
niggard's
niggaz
nigger
niggerhead
niggerhole
niggers
nigger's
niggle
niggled
niggles
niggling
nigglings
niggor
niggur
niglet
nignog
nigr
nigra
nigre
nip
nipple
nipplering
nittit
nlgger
nlggor
nofuckingway
nook
nookey
nookie
noonan
nooner
nude
nudger
nuke
nutfucker
nymph
ontherag
oral
orga
orgasim
orgasm
orgies
orgy
osama
paki
palesimian
palestinian
pansies
pansy
panti
panties
payo
pearlnecklace
peck
pecker
peckerwood
pee
peehole
pee-pee
peepshow
peepshpw
pendy
penetration
peni5
penile
penis
penises
penthouse
period
perv
phonesex
phuk
phuked
phuking
phukked
phukking
phungky
phuq
pi55
picaninny
piccaninny
pickaninny
piker
pikey
piky
pimp
pimped
pimper
pimpjuic
pimpjuice
pimpsimp
pindick
piss
pissed
pisser
pisses
pisshead
pissin
pissing
pissoff
pistol
pixie
pixy
playboy
playgirl
pocha
pocho
pocketpool
pohm
polack
pom
pommie
pommy
poo
poon
poontang
poop
pooper
pooperscooper
pooping
poorwhitetrash
popimp
porchmonkey
porn
pornflick
pornking
porno
pornography
pornprincess
pot
poverty
premature
pric
prick
prickhead
primetime
propaganda
pros
prostitute
protestant
pu55i
pu55y
pube
pubic
pubiclice
pud
pudboy
puddboy
puke
puntang
purinapricness
puss
pussie
pussies
pussy
pussycat
pussyeater
pussyfucker
pussylicker
pussylips
pussylover
pussypounder
pusy
quashie
queef
queer
quickie
quim
ra8s
rabbi
racial
racist
radical
radicals
raghead
randy
rape
raped
raper
rapist
rearend
rearentry
rectum
redlight
redneck
reefer
reestie
refugee
reject
remains
rentafuck
republican
rere
retard
retarded
ribbed
rigger
rimjob
rimming
roach
robber
roundeye
rump
russki
russkie
sadis
sadom
samckdaddy
sandm
sandnigger
satan
scag
scallywag
scat
schlong
screw
screwyou
scrotum
scum
semen
seppo
servant
sex
sexed
sexfarm
sexhound
sexhouse
sexing
sexkitten
sexpot
sexslave
sextogo
sextoy
sextoys
sexual
sexually
sexwhore
sexy
sexymoma
sexyslim
shag
shaggin
shagging
shat
shav
shawtypimp
sheeney
shhit
shinola
shit
shitcan
shitdick
shite
shiteater
shited
shitface
shitfaced
shitfit
shitforbrains
shitfuck
shitfucker
shitfull
shithapens
shithappens
shithead
shithouse
shiting
shitlist
shitola
shitoutofluck
shits
shitstain
shitted
shitter
shitting
shitty
shoot
shooting
shortfuck
showtime
sick
sissy
sixsixsix
sixtynine
sixtyniner
skank
skankbitch
skankfuck
skankwhore
skanky
skankybitch
skankywhore
skinflute
skum
skumbag
slant
slanteye
slapper
slaughter
slav
slave
slavedriver
sleezebag
sleezeball
slideitin
slime
slimeball
slimebucket
slopehead
slopey
slopy
slut
sluts
slutt
slutting
slutty
slutwear
slutwhore
smack
smackthemonkey
smut
snatch
snatchpatch
snigger
sniggered
sniggering
sniggers
snigger's
sniper
snot
snowback
snownigger
sob
sodomy
sodomise
sodomite
sodomize
sodomy
sonofabitch
sonofbitch
sooty
sos
soviet
spaghettibender
spaghettinigger
spank
spankthemonkey
sperm
spermacide
spermbag
spermhearder
spermherder
spic
spick
spig
spigotty
spik
spit
spitter
splittail
spooge
spreadeagle
spunk
spunky
squaw
stagg
stiffy
strapon
stringer
stripclub
stroke
stroking
stupid
stupidfuck
stupidfucker
suck
suckdick
sucker
suckme
suckmyass
suckmydick
suckmytit
suckoff
suicide
swallow
swallower
swalow
swastika
sweetness
syphilis
taboo
taff
tampon
tang
tantra
tarbaby
tard
teat
terror
terrorist
teste
testicle
testicles
thicklips
thirdeye
thirdleg
threesome
threeway
timbernigger
tinkle
tit
titbitnipply
titfuck
titfucker
titfuckin
titjob
titlicker
titlover
tits
tittie
titties
titty
tnt
toilet
tongethruster
tongue
tonguethrust
tonguetramp
tortur
torture
tosser
towelhead
trailertrash
tramp
trannie
tranny
transexual
transsexual
transvestite
triplex
trisexual
trojan
trots
tuckahoe
tunneloflove
turd
turnon
twat
twink
twinkie
twobitwhore
uck
uk
unfuckable
upskirt
uptheass
upthebutt
urinary
urinate
urine
usama
uterus
vagina
vaginal
vatican
vibr
vibrater
vibrator
vietcong
violence
virgin
virginbreaker
vomit
vulva
wab
wank
wanker
wanking
waysted
weapon
weenie
weewee
welcher
welfare
wetb
wetback
wetspot
whacker
whash
whigger
whiskey
whiskeydick
whiskydick
whit
whitenigger
whites
whitetrash
whitey
whiz
whop
whore
whorefucker
whorehouse
wigger
willie
williewanker
willy
wn
wog
women's
wop
wtf
wuss
wuzzie
xtc
xxx
yankee
yellowman
zigabo
zipperhead
`.split("\n")
        .map(word => word.trim())
        .filter(word => word.length > 0);

    useEffect(() => {
        if (!isUserLoggedIn()) {
            redirect("/login");
        }
        fetchPosts();
    }, [page]);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isBlocked) {
            setRudeNotice(`You are blocked from posting. Please wait ${blockTimer} seconds.`);
        }
    }, [blockTimer, isBlocked]);

    function getRandomNumber() {
        return Math.floor(Math.random() * 10000000) + 1;
    }

    const fetchPosts = () => {
        setLoading(true);
        getAllPosts()
            .then((res) => {
                const parsedPosts = res.data.map((post: Post) => ({
                    ...post,
                    createdAt: post.createdAt,
                }));
                setPosts((prevPosts) => [...prevPosts, ...parsedPosts]);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );
        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }
        return () => observerRef.current?.disconnect();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isBlocked) {
            interval = setInterval(() => {
                setBlockTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsBlocked(false);
                        setRudeAttempts(0);
                        setRudeNotice("");
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => interval && clearInterval(interval);
    }, [isBlocked]);

    const timeSince = (dateStr: string) => {
        const created = new Date(dateStr);
        let seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
        if (seconds < 0) seconds = 0;
        if (seconds < 5) return "just now";
        let interval = seconds / 31536000;
        if (interval >= 1) return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 2592000;
        if (interval >= 1) return `${Math.floor(interval)} month${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 86400;
        if (interval >= 1) return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 3600;
        if (interval >= 1) return `${Math.floor(interval)} hour${Math.floor(interval) > 1 ? "s" : ""} ago`;
        interval = seconds / 60;
        if (interval >= 1) return `${Math.floor(interval)} minute${Math.floor(interval) > 1 ? "s" : ""} ago`;
        return `${Math.floor(seconds)} second${Math.floor(seconds) > 1 ? "s" : ""} ago`;
    };

    const findRudeWords = (text: string) => {
        const lowerText = text.toLowerCase();
        const foundWords: string[] = [];
        rudeWords.forEach((word) => {
            const pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, "g");
            if (pattern.test(lowerText)) {
                foundWords.push(word);
            }
        });
        return Array.from(new Set(foundWords));
    };

    const handleCreatePost = () => {
        if (!newPost.trim()) return;
        if (isBlocked) {
            setRudeNotice(`You are blocked from posting. Please wait ${blockTimer} seconds.`);
            return;
        }
        const foundRudeWords = findRudeWords(newPost);
        if (foundRudeWords.length > 0) {
            const newAttempts = rudeAttempts + 1;
            setRudeAttempts(newAttempts);
            if (newAttempts >= 5) {
                setIsBlocked(true);
                setBlockTimer(60);
                setRudeNotice("Too many inappropriate attempts. You are blocked for 60 seconds.");
            } else {
                setRudeNotice(
                    `Your post contains inappropriate word(s): "${foundRudeWords.join('", "')}". Please remove them.`
                );
            }
            // Always trigger the warning video whenever rude words are found
            setShowWarningVideo(true);
            return;
        }
        setRudeNotice("");
        const loggedInUser = getLoggedInUser();
        const newPostObj: Post = {
            id: getRandomNumber(),
            postOwner: loggedInUser,
            content: newPost,
            title: "New Post",
            createdAt: new Date().toISOString(),
        };
        createPost(newPostObj)
            .then(() => {
                setPosts([]);
                setPage(1);
            })
            .catch((err) => {
                console.error(err);
            });
        setNewPost("");
    };

    // Render a smaller warning video (ohmygah.mp4) in a container under the warning message.
    const renderWarningVideo = () => (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white p-2 rounded shadow">
                <video
                    src="/ohmygah.mp4"
                    autoPlay
                    controls={false}
                    className="w-80"
                    onEnded={() => setShowWarningVideo(false)}
                />
            </div>
        </div>
    );

    // Render a smaller ban video (angry.mp4) with countdown in a container.
    const renderBanVideo = () => (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white p-2 rounded shadow">
                <video src="/angry.mp4" autoPlay loop controls={false} className="w-80" />
                <p className="mt-2 text-black text-center">You are banned for {blockTimer} seconds</p>
            </div>
        </div>
    );

    // --- Confirmation and edit functions (unchanged) ---
    const openConfirmModal = (actionType: string, postId: number) => {
        setConfirmModalType(actionType);
        setConfirmModalPostId(postId);
        setConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmModalOpen(false);
        setConfirmModalType("");
        setConfirmModalPostId(null);
    };

    const confirmDelete = () => {
        if (confirmModalPostId === null) return;
        deletePost(confirmModalPostId, loggedInUser)
            .then(() => {
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== confirmModalPostId)
                );
            })
            .catch((err) => {
                console.error(err);
            });
        closeConfirmModal();
    };

    const handleEditPost = (postId: number, currentContent: string) => {
        setEditingPostId(postId);
        setEditingContent(currentContent);
        setUpdateAttempts(0);
    };

    const cancelEdit = () => {
        setEditingPostId(null);
        setEditingContent("");
        setUpdateAttempts(0);
    };

    const confirmUpdate = () => {
        if (confirmModalPostId === null) return;
        const foundRude = findRudeWords(editingContent);
        if (foundRude.length > 0) {
            setUpdateAttempts((prev) => prev + 1);
            if (updateAttempts + 1 >= 5) {
                deletePost(confirmModalPostId, loggedInUser)
                    .then(() => {
                        alert("Your post has been automatically deleted due to repeated inappropriate update attempts.");
                        setPosts((prevPosts) =>
                            prevPosts.filter((post) => post.id !== confirmModalPostId)
                        );
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                closeConfirmModal();
                setEditingPostId(null);
                setEditingContent("");
                setUpdateAttempts(0);
                return;
            } else {
                setRudeNotice(
                    `Your update contains inappropriate word(s): "${foundRude.join('", "')}". Please remove them.`
                );
                closeConfirmModal();
                return;
            }
        }
        let updatedContent = editingContent;
        if (!updatedContent.endsWith(" (edited)")) {
            updatedContent += " (edited)";
        }
        updatePost(confirmModalPostId, loggedInUser, updatedContent)
            .then(() => {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === confirmModalPostId ? { ...post, content: updatedContent } : post
                    )
                );
                setEditingPostId(null);
                setEditingContent("");
                setUpdateAttempts(0);
            })
            .catch((err) => {
                console.error(err);
            });
        closeConfirmModal();
    };

    const handleUpdatePost = (postId: number) => {
        openConfirmModal("update", postId);
    };

    const handleDeletePost = (postId: number) => {
        openConfirmModal("delete", postId);
    };
    // --- End of confirmation/edit functions ---

    return (
        <div className="container mx-auto grid grid-cols-12 gap-4 p-5">
            {isBlocked && renderBanVideo()}
            {!isBlocked && rudeNotice && showWarningVideo && renderWarningVideo()}
            {/* Confirmation Modal */}
            {confirmModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-6 rounded shadow-lg z-10">
                        {confirmModalType === "delete" ? (
                            <p className="mb-4">Are you sure you want to delete this post?</p>
                        ) : (
                            <p className="mb-4">Are you sure you want to update this post?</p>
                        )}
                        <div className="flex justify-end gap-4">
                            <button onClick={closeConfirmModal} className="px-4 py-2 bg-gray-200 rounded">
                                Cancel
                            </button>
                            {confirmModalType === "delete" ? (
                                <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                                    Confirm
                                </button>
                            ) : (
                                <button onClick={confirmUpdate} className="px-4 py-2 bg-green-500 text-white rounded">
                                    Confirm
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Left: Downloadable Files */}
            <aside className="col-span-12 md:col-span-3 flex flex-col gap-4">
                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-2xl font-bold mb-3 text-green-800">UIT Academic System Rules</h2>
                    <a href="/UIT-Academic-Rules.pdf" download className="text-blue-500 hover:underline">
                        Download PDF
                    </a>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-2xl font-bold mb-3 text-green-800">UIT Curriculum (2022-2023)</h2>
                    <a href="/UIT-Curriculum.pdf" download className="text-blue-500 hover:underline">
                        Download PDF
                    </a>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5">
                    <h2 className="text-2xl font-bold mb-3 text-green-800">MALC Guide</h2>
                    <a href="/MALC.pdf" download className="text-blue-500 hover:underline">
                        Download PDF
                    </a>
                </div>
            </aside>

            {/* Center: Main Content (Feed) */}
            <main className="col-span-12 md:col-span-6">
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <Image src="/girl.png" alt="User" width={60} height={60} className="rounded-full" />
                        <input
                            type="text"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share something amazing..."
                            className="w-full border border-gray-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-800 transition duration-300"
                        />
                    </div>
                    {rudeNotice && (
                        <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {rudeNotice}
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        {!isBlocked && (
                            <button
                                onClick={handleCreatePost}
                                className="bg-green-800 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
                            >
                                Post
                            </button>
                        )}
                    </div>
                </div>
                {posts.length > 0 ? (
                    posts.map((post: Post, index: number) => (
                        <div
                            key={`${post.id}-${index}`}
                            className={`bg-white shadow-md rounded-xl p-5 mb-5 transition-shadow duration-300 hover:shadow-lg ${
                                post.postOwner === loggedInUser ? "bg-blue-50 border border-blue-200" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={`/${post.profileImage || "default.png"}`}
                                        alt="profileImage"
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div className="flex items-center">
                                        <p className="font-bold capitalize">{post.postOwner}</p>
                                        <GiRose size={25} className="ms-3 text-red-500" />
                                        <span className="text-pink-500 font-bold bg-pink-100 rounded px-2 py-1 ml-2">
                      {post.roseCount || 0}
                    </span>
                                    </div>
                                </div>
                                {post.postOwner === loggedInUser && (
                                    <div className="flex items-center gap-3">
                                        {editingPostId !== post.id ? (
                                            <>
                                                <button onClick={() => handleEditPost(post.id, post.content)}>
                                                    <Image src="/update.svg" alt="update" width={20} height={20} />
                                                </button>
                                                <button onClick={() => handleDeletePost(post.id)}>
                                                    <Image src="/delete.svg" alt="delete" width={20} height={20} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdatePost(post.id)}>
                                                    <Image src="/update.svg" alt="save" width={20} height={20} />
                                                </button>
                                                <button onClick={cancelEdit} className="text-gray-500">
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mb-2">
                                {timeSince(post.createdAt)}
                                {post.content.endsWith(" (edited)") && <span className="ml-2 text-xs text-gray-500">(edited)</span>}
                            </p>
                            {editingPostId === post.id ? (
                                <textarea
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            ) : (
                                <p className="text-gray-700">{post.content}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No posts available</p>
                )}
                <div ref={loadMoreRef} className="h-10"></div>
                {loading && <p className="text-center text-gray-500">Loading more posts...</p>}
            </main>

            {/* Right: Announcements Section */}
            <aside className="col-span-12 md:col-span-3">
                <div className="bg-gradient-to-r from-green-50 to-green-90 rounded-xl p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-3">Announcements</h2>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <span className="mr-2">📅</span>
                            Don’t forget the Friday Community Meetup at 6 PM.
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">📝</span>
                            Exam Schedule updated for next month—check your portal.
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">🏖️</span>
                            Holiday next Monday (campus closed).
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">📚</span>
                            New library hours: 8 AM - 10 PM on weekdays.
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}



