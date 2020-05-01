using System;
using System.ComponentModel.DataAnnotations;

namespace MyNdMap.Models
{
    public class File
    {
        [Key]
        public int FileId {get;set;}
        public string Title {get;set;}
        public string FilePath {get;set;}

        public int UserId {get;set;}
        public User Creator {get;set;}

        public DateTime CreatedAt {get;set;}
        
        public DateTime UpdatedAt {get;set;}

    }
}