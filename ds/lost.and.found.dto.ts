
/*
private Integer id;
    private String title;
    private String description;
    private String imageUrl;
    private boolean isFound;
    private String studentName;
 */

export type LostAndFoundDto = {
    id?:number;
    title: string;
    description: string;
    image:string;
    isFound: boolean;
    studentName?: string;
}